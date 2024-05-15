import React, { useRef } from "react";
// import axios from "axios";
import "./css/home.css";
import Footerbar from './Footerbar.jsx';
import { Link } from "react-router-dom";

export default function Home() {
  // const [user, setUser] = useState([]);

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  // const fetchUser = async () => {
  //   await axios.get("/home/user-info")
  //   .then((response)=>{
  //       const allRequest = response.data;
  //       setUser(allRequest);
  //       // console.log(user)
  //   })
  //   .catch ((error) => {
  //     console.error(`Error fetching user: ${error}`);
  //   });
  // }
   const sliderRef = useRef(null);

  const images = [
    {
      id: 1,
      url: "https://5.imimg.com/data5/SELLER/Default/2022/3/TX/KN/VL/148839554/dune-book.jpg",
    },
    {
      id: 2,
      url: "https://m.media-amazon.com/images/I/81QuEGw8VPL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 3,
      url: "https://m.media-amazon.com/images/I/814Ppc2uVOL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 4,
      url: "https://m.media-amazon.com/images/I/91ORJa-xI9L._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 5,
      url: "https://m.media-amazon.com/images/I/81rEhhwbubL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 6,
      url:
        "https://m.media-amazon.com/images/I/81gDHg8WtML._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 8,
      url:
        "https://www.jackreacher.com/wp-content/uploads/2020/08/jack_reacher_jacket_us_killing_floor@2x-654x1024.jpg"
    },
    {
      id: 9,
      url:
        "https://cdn.kobo.com/book-images/59683273-f798-47e6-9181-31009b062228/1200/1200/False/iron-man-3-movie-storybook.jpg"
    },
    {
      id: 10,
      url:
        "https://i.pinimg.com/originals/41/16/6b/41166b094b9a60ce2188d4fe55e923d8.jpg"
    },
    {
      id: 11,
      url:
        "https://i.etsystatic.com/15103941/r/il/52523c/1322328563/il_fullxfull.1322328563_lp6l.jpg"
    },
    {
      id: 12,
      url: "https://m.media-amazon.com/images/I/81qnmKBX2XL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 13,
      url: "https://m.media-amazon.com/images/I/61-Llo1WVkL._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 14,
      url: "https://rukminim2.flixcart.com/image/850/1000/xif0q/regionalbooks/9/g/w/rich-dad-080-original-imafxp2hrbfp6ptc.jpeg?q=90&crop=false"
    }
  ];


  return (
    <>
      {/* <div className="user-info">
        <div className="profile-icon">U</div>
        <p>User ID:<span>{user.id}</span></p>
        <p>Name:<span>{user.name}</span></p>
        <p>Email:<span>{user.email}</span></p>
        <p>Contact Number:<span>{user.contact_number}</span></p>
        <p>Role:<span>{user.role}</span></p>
        <p>LibID:<span>{user.lib_id}</span></p>
      </div> */}
      <div className="book-box">
        <div className="images-container" ref={sliderRef}>
          {images.map((image) => {
            return (
              <>
                <Link to="/books/allbooks">
                  <img className="image" alt="sliderImage" key={image?.id} src={image?.url} />
                </Link>
                {/* <h3>{image?.name}</h3> */}
              </>
            );
          })}
        </div>
      </div>
      <Footerbar/>
    </>
  );
}