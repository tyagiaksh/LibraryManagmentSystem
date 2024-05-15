package model

import (
	"time"
	

)

type Library struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}


type Users struct {
	ID      int    			`form:"id" json:"id"`
	Name    string 			`form:"name" json:"name"`
	Email   string 			`form:"email" json:"email"`
	ContactNumber string 	`form:"contact_number" json:"contact_number"`
	Role    string 			`form:"role" json:"role"`
	LibID   int    			`form:"lib_id" json:"lib_id"`
	Password string 		`form:"password" json:"password"`
}

type OTPCheck struct{
	OTP string `form:"otp" json:"otp"`
}

type BookInventory struct {
	ISBN            string `form:"isbn" json:"isbn" `
	LibID           int    `form:"lib_id" json:"lib_id"`
	Title           string `form:"title" json:"title"`
	Authors          string `form:"authors" json:"authors"`
	Publisher       string `form:"publisher" json:"publisher"`
	Version         int    `form:"version" json:"version"`
	TotalCopies     int    `form:"total_copies" json:"total_copies"`
	AvailableCopies int    `form:"available_copies" json:"available_copies"`
	Image			string	`form:"image" json:"image"`
}

type RequestEvents struct {
	ReqID        int       `form:"id"`
	BookID       string    `form:"isbn"`
	ReaderID     int       `form:"rid"`
	RequestDate  time.Time `form:"date"`
	ApprovalDate string `form:"Adate"`
	ApproverID   int       `form:"Aid"`
	RequestType  string    `form:"Rtype"`
	Request 	 string    `form:"request"`
}

type IssueRegistry struct {
	IssueID            int
	ISBN               string
	ReaderID           int
	IssueApproverID    int
	IssueStatus		   string
	IssueDate          string
	ExpectedReturnDate time.Time
	ReturnDate         time.Time
	ReturnApproverID   int
}