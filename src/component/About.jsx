import React from "react";
import "./css/about.css"
import { Link } from "react-router-dom";


const About = () => {
	return (
		<>
			<div className="image-back" style={{ backgroundImage: `url('https://i0.wp.com/stanzaliving.wpcomstaging.com/wp-content/uploads/2022/04/473e6-library-in-hyderabad.jpg?fit=1000%2C500&ssl=1')` }}>
				
				<div className="about-page">
					<h1>About Us</h1>
					<p>
						Our library management system is designed to help you easily manage and
						access our library's resources. As a reader, you can search for books,
						request to issue a book, and even request to return a book, all within
						this system.
					</p>
					<p>
						We aim to provide a seamless and user-friendly experience for all our
						users. Our system is constantly updated to ensure that it meets your
						needs and provides you with the best possible service.
					</p>
					<p>
						If you have any questions or concerns, please don't hesitate to 
						<Link to="/contact"> contact </Link>
						us. We're always here to help!
					</p>
				</div>
	
			</div>
		</>
	);
};

export default About;
