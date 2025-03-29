import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const courses = [
  { id: 1, title: "React Basics", description: "Learn React from scratch.", color: "#61dafb", icon: "📘" },
  { id: 2, title: "Advanced JavaScript", description: "Deep dive into JS.", color: "#f7df1e", icon: "🔥" },
  { id: 3, title: "Node.js Backend", description: "Build backend with Node.js.", color: "#6cc24a", icon: "🚀" },
  { id: 4, title: "AI with Python", description: "Learn AI using Python.", color: "#3776ab", icon: "🤖" },
];

// Styled Components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 60px;
  justify-content: center;
  background: linear-gradient(135deg, #121212 0%, #1e1e2f 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
`;

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 320px;
  padding: 35px 30px;
  border-radius: 20px;
  background: #1a1a2e;
  color: white;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(${props => {
    const hex = props.color?.replace('#', '') || '007bff';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}, 0.2`;
  }});
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(${props => {
      const hex = props.color?.replace('#', '') || '007bff';
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}, 0.3`;
    }});
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.color || '#007bff'};
  opacity: 0.15;
  filter: blur(30px);
  z-index: 0;
`;

const IconCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 25px;
  font-size: 2.2rem;
  position: relative;
  border: 2px solid rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${props => props.color || '#007bff'}, transparent);
    opacity: 0.3;
    z-index: -1;
  }
`;

const Title = styled.h3`
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 15px;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 2;
`;

const Description = styled.p`
  font-size: 1.1rem;
  opacity: 0.75;
  line-height: 1.7;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 2;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.enrolled ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.enrolled ? '#28a745' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 0.8rem;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.enrolled ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
  z-index: 2;
`;

const Button = styled.button`
  background: ${(props) => {
    if (props.leave) return "linear-gradient(45deg, #dc3545, #c82333)";
    if (props.enrolled) return "linear-gradient(45deg, #28a745, #218838)";
    return `linear-gradient(45deg, ${props.color || '#007bff'}, ${props.color ? props.color + '99' : '#0056b3'})`;
  }};
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
    transition: 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.3);
    
    &:before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  }
`;

const EnrolledCount = styled.div`
  position: fixed;
  top: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1rem;
  padding: 12px 20px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🎓';
    font-size: 1.2rem;
  }
`;

const PageTitle = styled.h1`
  position: relative;
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 800;
  letter-spacing: 1px;
  width: 100%;
  text-transform: uppercase;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #61dafb, #f7df1e);
    border-radius: 2px;
  }
`;

const CoursesPage = () => {
  const [enrolled, setEnrolled] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || {};
    setEnrolled(storedCourses);
  }, []);

  const handleEnroll = (courseTitle) => {
    const updatedEnrolled = { ...enrolled, [courseTitle]: true };
    setEnrolled(updatedEnrolled);
    localStorage.setItem("enrolledCourses", JSON.stringify(updatedEnrolled));
  };

  const handleLeave = (courseTitle) => {
    const updatedEnrolled = { ...enrolled };
    delete updatedEnrolled[courseTitle]; // Remove from state
    
    // Remove all course-related data from localStorage
    localStorage.removeItem(`chapters_${courseTitle}`);
    localStorage.removeItem("enrolledCourses"); // Reset enrolled courses
    localStorage.setItem("enrolledCourses", JSON.stringify(updatedEnrolled)); // Save updated courses
    
    setEnrolled(updatedEnrolled);
  };

  const enrolledCount = Object.keys(enrolled).length;

  return (
    <Container>
      <PageTitle>Developer Academy</PageTitle>
      
      {courses.map((course) => (
        <Card key={course.id} color={course.color}>
          <GlowEffect color={course.color} />
          <StatusBadge enrolled={enrolled[course.title]}>
            {enrolled[course.title] ? "Enrolled" : "Available"}
          </StatusBadge>
          
          <IconCircle color={course.color}>
            {course.icon}
          </IconCircle>
          
          <Title>{course.title}</Title>
          <Description>{course.description}</Description>
          
          {!enrolled[course.title] ? (
            <Button 
              color={course.color} 
              onClick={() => handleEnroll(course.title)}
            >
              Enroll Now
            </Button>
          ) : (
            <ButtonContainer>
              <Button 
                enrolled 
                onClick={() => navigate(`/course/${course.title}`)}
              >
                Continue
              </Button>
              <Button 
                leave 
                onClick={() => handleLeave(course.title)}
              >
                Leave Course
              </Button>
            </ButtonContainer>
          )}
        </Card>
      ))}
      
      {enrolledCount > 0 && (
        <EnrolledCount>
          {enrolledCount} course{enrolledCount !== 1 ? 's' : ''} enrolled
        </EnrolledCount>
      )}
    </Container>
  );
};

export default CoursesPage;