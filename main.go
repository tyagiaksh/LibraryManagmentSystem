package main

import (
	"database/sql"
	"fmt"
	"go-backend/model"
	"log"

	// "math/rand"
	"net/http"
	// "net/smtp"
	// "strconv"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var store = cookie.NewStore([]byte("secret"))

func addBook(db *sql.DB, c *gin.Context) {

	// var lib model.Library
	// ID:=c.PostForm("lib_id")
	// log.Println(ID)
	// row := db.QueryRow("SELECT * FROM Library WHERE ID = ?", ID)
	// err := row.Scan(&lib.ID,&lib.Name)
	// if err == sql.ErrNoRows {
	// 	log.Println("err1", err)
	// 	c.JSON(http.StatusNotFound, gin.H{"error": "Library Not Found"})
	// 	return
	// } else if err != nil {
	// 	log.Println("err2", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find Library"})
	// 	return
	// }

	var book model.BookInventory

	if err := c.Bind(&book); err != nil {
		log.Println("err1", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("book", book)
	if book.AvailableCopies > book.TotalCopies{
		c.JSON(400, gin.H{"error": "Bad request!"})
	}else{
		_, err := db.Exec("INSERT INTO BookInventory (ISBN, LibID, Title, Authors, Publisher, Version, TotalCopies, AvailableCopies, BookImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		book.ISBN, book.LibID, book.Title, book.Authors, book.Publisher, book.Version, book.TotalCopies, book.AvailableCopies, book.Image)

	if err != nil {
		log.Println("err2", err)
		c.JSON(403, gin.H{"error": "Book already Exist"})
		return
	}

	c.JSON(http.StatusCreated, book)
	}
	
}

func ListAllBooks(db *sql.DB, c *gin.Context) {

	// Execute a SQL query to retrieve the BookInventory data
	rows, err := db.Query(`SELECT * FROM BookInventory`)
	if err != nil {
		log.Println("err1", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	// Initialize a slice of BookInventory structs
	var books []model.BookInventory
	// Scan each row into a BookInventory struct
	for rows.Next() {
		var book model.BookInventory
		err := rows.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies, &book.Image)
		if err != nil {
			log.Println("err2", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		// Append the scanned BookInventory struct to the slice
		books = append(books, book)
	}
	// Check for any errors

	err = rows.Err()
	if err != nil {
		log.Println("err3", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	// Set the response to the slice of BookInventory structs
	c.JSON(http.StatusOK, books)
}

func deletebook(db *sql.DB, c *gin.Context) {

	ISBN := c.PostForm("isbn")
	log.Println("id", ISBN)
	var book model.BookInventory
	row := db.QueryRow("SELECT * FROM BookInventory WHERE ISBN = ?", ISBN)
	err := row.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies, &book.Image)
	if err == sql.ErrNoRows {
		log.Println("err1", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	} else if err != nil {
		log.Println("err2", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find book"})
		return
	} else {

		_, err := db.Exec("DELETE FROM BookInventory WHERE isbn = ?", ISBN)
		if err != nil {
			log.Println("err", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book."})
		} else {
			c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
		}
	}
}

func updateBook(db *sql.DB, c *gin.Context) {

	ISBN := c.PostForm("isbn")
	log.Println("ISBN", ISBN)
	var book model.BookInventory
	if err := c.Bind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("book", book)
	_, err := db.Exec("UPDATE BookInventory SET LibID = ?, Title = ?, Authors = ?, Publisher = ?, Version = ?, TotalCopies = ?, AvailableCopies = ? WHERE ISBN = ? ",
		book.LibID, book.Title, book.Authors, book.Publisher, book.Version, book.TotalCopies, book.AvailableCopies, ISBN)

	if err != nil {
		log.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book."})
		return
	}
	c.JSON(http.StatusCreated, book)

}

func issueRequest(db *sql.DB, c *gin.Context) {
	var book model.BookInventory
	ISBN := c.PostForm("isbn")
	if err := c.Bind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	row := db.QueryRow("SELECT ISBN, LibID, Title, Authors, Publisher, Version, TotalCopies, AvailableCopies FROM BookInventory WHERE ISBN = ?", ISBN)
	err := row.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find book"})
		return
	} else {

		var issue model.RequestEvents

		// issue.RequestDate = time.Now()
		// issue.RequestDate = time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 0, 0, 0, 0, time.UTC)
		RequestDate := time.Now().Format("2006-01-02")

		if err := c.Bind(&issue); err != nil {
			log.Println("err", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Println("issue", issue)
		_, err1 := db.Exec("INSERT INTO RequestEvents (BookID,	ReaderID, RequestDate, RequestType ) VALUES (?, ?, ?, ?)",
			issue.BookID, issue.ReaderID, RequestDate, issue.RequestType)
		// log.Println(issue.RequestType)
		if err1 != nil {
			log.Println("err", err1)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to issue request"})
			return
		}
		c.JSON(http.StatusCreated, issue)
	}
}

func findBook(db *sql.DB, c *gin.Context) {
	Title := c.Param("title")
	log.Println(Title)
	if Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title query parameter is required"})
		return
	}
	// Check if book exists
	row := db.QueryRow("SELECT ISBN, LibID, Title, Authors, Publisher, Version, TotalCopies, AvailableCopies, BookImage FROM BookInventory WHERE Title = ?", Title)
	var book model.BookInventory
	err := row.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies, &book.Image)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find book"})
		return
	}
	log.Println(book)
	c.JSON(http.StatusOK, book)

	
}

func ListRequest(db *sql.DB, c *gin.Context) {
	// var myTime rawTime
	rows, err := db.Query(`SELECT ReqID, BookID, ReaderID, RequestDate, COALESCE(ApprovalDate, ''), COALESCE(ApproverID, 0) as ApproverID, RequestType, COALESCE(Request, '') as Request FROM RequestEvents`)
	if err != nil {
		log.Println("err1", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	// Initialize a slice of RequestEvents structs
	var reqs []model.RequestEvents
	// Scan each row into a RequestEvents struct
	for rows.Next() {
		var req model.RequestEvents
		err := rows.Scan(&req.ReqID, &req.BookID, &req.ReaderID, &req.RequestDate, &req.ApprovalDate, &req.ApproverID, &req.RequestType, &req.Request)
		if err != nil {
			log.Println("err2", err)
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		// Append the scanned RequestEvents struct to the slice
		reqs = append(reqs, req)
	}
	// Check for any errors
	err = rows.Err()
	if err != nil {
		log.Println("err3", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	// Set the response to the slice of RequestEvents structs
	c.JSON(http.StatusOK, reqs)
}

func RejectRequest(db *sql.DB, c *gin.Context) {
	// ID := c.PostForm("id")
	// log.Println(ID)
	// AID := c.PostForm("Aid")
	var req model.RequestEvents
	if err := c.Bind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	AID := 1
	row := db.QueryRow("SELECT ReqID, BookID, ReaderID, RequestDate, coalesce(ApprovalDate, '') ApprovalDate, coalesce(ApproverID, 0) ApproverID, RequestType, coalesce(Request, '') Request FROM RequestEvents WHERE ReqID = ?", req.ReqID)
	err := row.Scan(&req.ReqID, &req.BookID, &req.ReaderID, &req.RequestDate, &req.ApprovalDate, &req.ApproverID, &req.RequestType, &req.Request)
	if err == sql.ErrNoRows {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Request Not Found"})
		return
	} else if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find Request"})
		return
	} else {

		// ApprovalDate := time.Now().Format("2006-01-02")
		req.Request = "Rejected"

		var issue model.IssueRegistry
		issue.ISBN = req.BookID
		issue.ReaderID = req.ReaderID
		issue.IssueApproverID = AID
		issue.IssueStatus = req.Request
		issue.IssueDate = time.Now().Format("2006-01-02")
		_, err2 := db.Exec("INSERT INTO IssueRegistry (ISBN, ReaderID, IssueApproverID, IssueStatus, IssueDate) VALUES (?, ?, ?, ?, ?)",
			issue.ISBN, issue.ReaderID, issue.IssueApproverID, issue.IssueStatus, issue.IssueDate)

		if err2 != nil {
			log.Println("err", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Reject Request"})
			return
		}
		_, err := db.Exec("Delete From RequestEvents  WHERE ReqID = ?", req.ReqID)
		if err != nil {
			log.Println("err", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Delete Request"})
			return
		}
		c.JSON(http.StatusOK, req)
	}
}

func ApproveRequest(db *sql.DB, c *gin.Context) {
	// ID := c.PostForm("id")

	// AID := c.PostForm("Aid")

	var req model.RequestEvents
	if err6 := c.Bind(&req); err6 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err6.Error()})
		return
	} else if req.ReqID != ' ' {
		row := db.QueryRow("SELECT ReqID, BookID, ReaderID, RequestDate, coalesce(ApprovalDate, '') ApprovalDate, coalesce(ApproverID, 0) ApproverID, RequestType, coalesce(Request, '') Request FROM RequestEvents WHERE ReqID = ?", req.ReqID)
		err := row.Scan(&req.ReqID, &req.BookID, &req.ReaderID, &req.RequestDate, &req.ApprovalDate, &req.ApproverID, &req.RequestType, &req.Request)
		if err == sql.ErrNoRows {
			log.Println(err)
			c.JSON(http.StatusNotFound, gin.H{"error": "Request Not Found"})
			return
		} else if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find Request"})
			return
		} else {
			// ApprovalDate := time.Now().Format("2006-01-02")
			// req.Request = "Approved"
			AID := 1

			var issue model.IssueRegistry
			issue.ISBN = req.BookID
			issue.ReaderID = req.ReaderID
			issue.IssueApproverID = AID
			issue.IssueStatus = req.RequestType
			issue.IssueDate = time.Now().Format("2006-01-02")
			_, err2 := db.Exec("INSERT INTO IssueRegistry (ISBN, ReaderID, IssueApproverID, IssueStatus, IssueDate) VALUES (?, ?, ?, ?, ?)",
				issue.ISBN, issue.ReaderID, issue.IssueApproverID, issue.IssueStatus, issue.IssueDate)

			if err2 != nil {
				log.Println("err", err2)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Add issue in IssueRegistry"})
				return
			}
			_, err5 := db.Exec("Delete From RequestEvents WHERE ReqID = ?", &req.ReqID)
			if err5 != nil {
				log.Println("err", err5)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to Delete Request"})
			}
			var book model.BookInventory
			row := db.QueryRow("SELECT * FROM BookInventory WHERE ISBN = ?", req.BookID)
			err4 := row.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies, &book.Image)
			if err4 != nil {
				log.Println(err4)
				c.JSON(http.StatusBadRequest, gin.H{"message": "Book is not available "})
				return
			}
			if book.TotalCopies < 1 {
				c.JSON(http.StatusAccepted, gin.H{"message": "Book is not available "})
				return
			}
			if book.AvailableCopies <= 0 && book.TotalCopies >= 1 {
				c.JSON(http.StatusAccepted, gin.H{"message": " All books are already issued"})
				return
			}
			// after the book approval save the book copies left
			book.AvailableCopies = book.AvailableCopies - 1
			log.Println(book.AvailableCopies)
			_, err3 := db.Exec("UPDATE BookInventory SET AvailableCopies = ? WHERE ISBN = ?", book.AvailableCopies, req.BookID)
			if err3 != nil {
				log.Println(err3)
				c.JSON(http.StatusBadRequest, gin.H{"message": "Failed To Issue Book"})
				return
			}
		}
	}
	c.JSON(http.StatusCreated, req)
}

// func genrateOTP() int {
// 	otp := rand.Intn(1000000)
// 	log.Println(otp)
// 	return otp
// }

// func SendOTP(email string, otp int) error {

// 	from := "tyagiaakash755@gmail.com"
// 	to := []string{
// 		email,
// 	}

// 	message := []byte("From: tyagiaakash755@gmail.com\r\n" +

// 		"To: " + email + "\r\n" +

// 		"Subject: OTP\r\n" +

// 		"\r\n" +

// 		"Your OTP is: " + fmt.Sprint(otp))

// 	smtpHost := "smtp.gmail.com"
// 	smtpPort := "465"
// 	smtppassword := "lotz fkvc cyvg tnne"

// 	auth := smtp.PlainAuth("", from, smtppassword, smtpHost)

// 	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
// 	if err != nil {
// 		log.Println("err", err)
// 		return err
// 	} else {
// 		fmt.Println("Email Sent Successfully!")
// 	}
// 	return err
// }

func login(db *sql.DB, c *gin.Context) {

	var user model.Users
	// Email := c.PostForm("email")
	// log.Println("email", Email)
	if err := c.Bind(&user); err != nil {
		log.Println("err1", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("email", user.Email)
	session := sessions.Default(c)
	session.Set("email", user.Email)
	err := db.QueryRow("SELECT Email, Role, Password FROM Users WHERE Email = ?", user.Email).Scan(&user.Email, &user.Role, &user.Password)

	if err == sql.ErrNoRows {
		log.Println("err2", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// OTP := genrateOTP()
	log.Println(user.Password)

	session.Set("role", user.Role)
	session.Set("password", user.Password)
	session.Save()

	// err = SendOTP(user.Email, OTP)
	// if err != nil {
	// 	log.Println("err", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
	// 	return
	// }
	// c.HTML(http.StatusOK, "otp.html", nil)

}

func verfiyOTP(c *gin.Context) {
	var user model.Users

	if err := c.Bind(&user); err != nil {
		log.Println("err", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("password", user.Password)
	session := sessions.Default(c)
	savedRole := session.Get("role")
	savedOTP := session.Get("password")
	if savedOTP != user.Password {
		c.JSON(http.StatusBadRequest, "Invalid Password!")
	} else {
		c.JSON(http.StatusOK, savedRole)
	}
}

// func verfiyOTP(c *gin.Context) {
// 	OTP := c.PostForm("otp")
// 	log.Println("msg",OTP)
// 	if err:=c.Bind(&OTP); err!= nil {
// 		log.Println("err",err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	OTPN,_ := strconv.Atoi(OTP)
// 	session := sessions.Default(c)
// 	savedRole := session.Get("role")
// 	savedOTP := session.Get("otpn")
// 	if savedOTP != OTPN{
// 		log.Println(404, "invalid OTP")
// 	} else {
// 		if savedRole == "Reader" {
// 			c.HTML(http.StatusOK, "user.html", nil)
// 		}
// 		if savedRole == "Admin" {
// 			c.HTML(http.StatusOK, "admin.html", nil)
// 		}
// 	}
// }

// func authMiddleware(requiredRole string) gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		session := sessions.Default(c)
// 		savedRole := session.Get("role")
// 		if savedRole == nil || savedRole.(string) != requiredRole {
// 			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
// 			return
// 		}
// 		c.Next()
// 	}
// }

func logout(c *gin.Context) {

	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.JSON(200, "LogOut SuccessFull !")
	// c.Redirect(http.StatusFound, "/home/login")
}

func signUp(db *sql.DB, c *gin.Context) {

	var user model.Users

	if err := c.Bind(&user); err != nil {
		log.Println("err", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("user", user)
	_, err := db.Exec("INSERT INTO Users (Name, Email, ContactNumber, Role, LibID, Password) VALUES (?, ?, ?, ?, ?, ?)",
		user.Name, user.Email, user.ContactNumber, user.Role, user.LibID, user.Password)

	if err != nil {
		log.Println("err", err)
		c.JSON(404, gin.H{"error": "Failed to add user."})
		return
	} else {
		c.JSON(200, "User Added Successfully!")
	}
	// OTP := genrateOTP()
	// session := sessions.Default(c)
	// session.Set("role", user.Role)
	// session.Set("otpn", OTP)
	// session.Save()
	// err = SendOTP(user.Email, OTP)
	// if err != nil {
	// 	log.Println("err", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
	// 	return
	// }
	// c.HTML(http.StatusOK, "otp.html", nil)
}

func sendRole(c *gin.Context) {
	session := sessions.Default(c)
	savedRole := session.Get("role")
	c.JSON(http.StatusOK, savedRole)
}

func userInfo(db *sql.DB, c *gin.Context) {
	session := sessions.Default(c)
	savedEmail := session.Get("email")
	log.Println(savedEmail)
	var user model.Users
	err := db.QueryRow("SELECT ID, Name, Email, ContactNumber, Role, LibID FROM Users WHERE Email = ?", savedEmail).Scan(&user.ID, &user.Name, &user.Email, &user.ContactNumber, &user.Role, &user.LibID)
	if err == sql.ErrNoRows {
		log.Println("err", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find User"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func main() {

	db, err := sql.Open("sqlite3", "/home/xs450-akatag/go-backend/db/mydb.db")

	r := gin.Default()
	r.Use(sessions.Sessions("mysession", store))

	if err != nil {
		println("error here")
	} else {
		println("Connected")
	}

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true
	// config.AllowHeaders = []string{"Content-Type"}
	r.Use(cors.New(config))
	log.Println(config)
	r.LoadHTMLGlob("./html/*.html")

	admin := r.Group("/admin")
	// admin.Use(authMiddleware("Admin"))
	{
		admin.GET("/add-book", func(c *gin.Context) {
			c.HTML(http.StatusOK, "addBook.html", nil)
		})
		admin.GET("/admin-dashboard", func(c *gin.Context) {
			c.HTML(http.StatusOK, "admin.html", nil)
		})
		admin.GET("/delete-book", func(c *gin.Context) {
			c.HTML(http.StatusOK, "deleteBook.html", nil)
		})
		admin.GET("/update-book", func(c *gin.Context) {
			c.HTML(http.StatusOK, "updateBook.html", nil)
		})
		admin.GET("/approve-request", func(c *gin.Context) {
			c.HTML(http.StatusOK, "approve.html", nil)
		})
		admin.GET("/reject-request", func(c *gin.Context) {
			c.HTML(http.StatusOK, "reject.html", nil)
		})

		admin.POST("/add-book", func(c *gin.Context) {
			addBook(db, c)
		})
		admin.GET("/all-books", func(c *gin.Context) {
			ListAllBooks(db, c)
		})
		admin.GET("/list-issue-request", func(c *gin.Context) {
			ListRequest(db, c)
		})
		admin.POST("/delete-book", func(c *gin.Context) {
			deletebook(db, c)
		})
		admin.POST("/update-book", func(c *gin.Context) {
			updateBook(db, c)
		})
		admin.POST("/approve-request", func(c *gin.Context) {
			ApproveRequest(db, c)
		})
		admin.POST("/reject-request", func(c *gin.Context) {
			RejectRequest(db, c)
		})
	}

	home := r.Group("/home")
	{
		home.GET("/", func(c *gin.Context) {
			c.HTML(http.StatusOK, "home.html", nil)
		})
		home.GET("/login", func(c *gin.Context) {
			c.HTML(http.StatusOK, "login.html", nil)
		})
		home.GET("/otp", func(c *gin.Context) {
			c.HTML(http.StatusOK, "otp.html", nil)
		})
		home.GET("/signup", func(c *gin.Context) {
			c.HTML(http.StatusOK, "signup.html", nil)
		})

		home.POST("/signup", func(c *gin.Context) {
			signUp(db, c)
		})
		home.POST("/login", func(c *gin.Context) {
			login(db, c)
		})
		home.POST("/otp", func(c *gin.Context) {
			verfiyOTP(c)
		})
		home.GET("/get-role", func(c *gin.Context) {
			sendRole(c)
		})
		home.GET("/logout", logout)
		home.GET("/user-info", func(c *gin.Context) {
			userInfo(db, c)
		})
		home.GET("/search/:title", func(c *gin.Context) {
			findBook(db, c)
		})
	}

	user := r.Group("/user")
	// user.Use(authMiddleware("Reader"))
	{
		user.GET("/dashboard", func(c *gin.Context) {
			c.HTML(http.StatusOK, "user.html", nil)
		})
		user.GET("/issue-request", func(c *gin.Context) {
			c.HTML(http.StatusOK, "issueRequest.html", nil)
		})
		// user.GET("/search", func(c *gin.Context) {
		// 	c.HTML(http.StatusOK, "search.html", nil)
		// })

		user.POST("/issue-request", func(c *gin.Context) {
			issueRequest(db, c)
		})
		// user.POST("/search", func(c *gin.Context) {
		// 	findBook(db, c)
		// })
	}

	r.Run(":8080")

}
