import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const fetchChaptersFromBackend = async (courseTitle) => {
  try {
    console.log("Fetching chapters for course:", courseTitle);
    const response = await fetch("http://127.0.0.1:8000/generate-chapters/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_name: courseTitle }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chapters");
    }

    const data = await response.json();
    console.log("Received chapters from backend:", data);
    return data.chapters || [];
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
};

// Styled Components
const ContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1e1e2f 100%);
  color: white;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(243, 156, 18, 0.05);
    filter: blur(60px);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(243, 156, 18, 0.05);
    filter: blur(60px);
    z-index: 0;
  }
`;

const Container = styled.div`
  padding: 40px;
  width: 90%;
  max-width: 700px;
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(10px);
  color: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(243, 156, 18, 0.1);
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(243, 156, 18, 0.2);
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const BackButton = styled.button`
  background: linear-gradient(45deg, #f39c12, #e67e22);
  color: #121212;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(243, 156, 18, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(243, 156, 18, 0.3);
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 10px rgba(243, 156, 18, 0.2);
  }
`;

const Title = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 30px;
  font-weight: 800;
  background: linear-gradient(45deg, #f39c12, #e67e22);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  word-break: break-word;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #f39c12, #e67e22);
    border-radius: 2px;
  }
`;

const ChapterList = styled.ul`
  list-style-type: none;
  padding: 0;
  text-align: left;
  margin-top: 40px;
`;

const ChapterItem = styled.li`
  padding: 18px 20px;
  background: rgba(42, 42, 58, 0.7);
  margin: 16px 0;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  font-size: 1.1rem;
  border: 1px solid rgba(243, 156, 18, ${props => props.completed ? 0.4 : 0.1});
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.completed ? "#f39c12" : "#fff"};
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 5px;
    background: ${props => props.completed ? "#f39c12" : "transparent"};
    border-radius: 3px 0 0 3px;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: linear-gradient(45deg, rgba(243, 156, 18, 0.9), rgba(230, 126, 34, 0.9));
    color: #121212;
    box-shadow: 0 10px 20px rgba(243, 156, 18, 0.3);
    
    &::before {
      background: white;
    }
  }
`;

const ChapterNumber = styled.span`
  background: rgba(0, 0, 0, 0.2);
  color: ${props => props.completed ? "#f39c12" : "rgba(255, 255, 255, 0.7)"};
  font-weight: bold;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 20px;
  margin-right: 15px;
  
  ${ChapterItem}:hover & {
    background: rgba(255, 255, 255, 0.2);
    color: #121212;
  }
`;

const ChapterContent = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ChapterTitle = styled.span`
  flex: 1;
`;

const CompletedBadge = styled.span`
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  
  &::before {
    content: '✓';
    margin-right: 5px;
    font-weight: bold;
  }
  
  ${ChapterItem}:hover & {
    background: rgba(255, 255, 255, 0.2);
    color: #121212;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
`;

const LoadingText = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(243, 156, 18, 0.1);
  border-radius: 50%;
  border-top: 5px solid #f39c12;
  animation: spin 1.5s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CourseDetails = () => {
  const { courseTitle } = useParams();
  const navigate = useNavigate();
  const decodedCourseTitle = decodeURIComponent(courseTitle || "");

  console.log("Course Title from URL:", decodedCourseTitle); // Debugging

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedCourseTitle) {
      console.error("Invalid course title in URL");
      setLoading(false);
      return;
    }

    const loadChapters = async () => {
      try {
        setLoading(true);
        console.log("Checking localStorage for:", `chapters_${decodedCourseTitle}`);

        const storedChapters = JSON.parse(localStorage.getItem(`chapters_${decodedCourseTitle}`));

        if (storedChapters && storedChapters.length > 0 && typeof storedChapters[0] === "object") {
          console.log("Loaded chapters from localStorage:", storedChapters);
          setChapters(storedChapters);
        } else {
          console.log("Fetching chapters from backend...");
          const fetchedChapters = await fetchChaptersFromBackend(decodedCourseTitle);

          // Convert string array to object format
          const formattedChapters = fetchedChapters.map((chapter) => ({
            title: chapter,
            completed: false, // Default value
          }));

          console.log("Formatted chapters:", formattedChapters);

          setChapters(formattedChapters);
          localStorage.setItem(`chapters_${decodedCourseTitle}`, JSON.stringify(formattedChapters));
        }
      } catch (error) {
        console.error("Error loading chapters:", error);
      } finally {
        setLoading(false);  
      }
    };

    loadChapters();
  }, [decodedCourseTitle]); 

  const handleChapterClick = (chapter) => {
    if (!chapter || !chapter.title) {
      console.error("Invalid chapter data:", chapter);
      return;
    }
  
    const encodedChapterTitle = encodeURIComponent(chapter.title);
    sessionStorage.setItem("currentChapter", chapter.title);
    navigate(`/online-course/${decodedCourseTitle}/${encodedChapterTitle}`);
  };
  
  
  

  return (
    <ContainerWrapper>
      <Container>
        {/* Back Button */}
        <BackButton onClick={() => navigate(-1)}>
          ← Back to Courses
        </BackButton>

        <Title>{decodedCourseTitle ? `${decodedCourseTitle}` : "Invalid Course"}</Title>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading chapters...</LoadingText>
          </LoadingContainer>
        ) : chapters.length === 0 ? (
          <LoadingContainer>
            <LoadingText>No chapters found for this course.</LoadingText>
            <BackButton onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
              Return to Courses
            </BackButton>
          </LoadingContainer>
        ) : (
          <ChapterList>
            {chapters.map((chapter, index) => (
  <ChapterItem
    key={index}
    completed={chapter.completed}
    onClick={() => handleChapterClick(chapter)}
  >
    <ChapterContent>
      <ChapterNumber completed={chapter.completed}>
        {index + 1}
      </ChapterNumber>
      <ChapterTitle>{chapter.title}</ChapterTitle>
    </ChapterContent>
    {chapter.completed && <CompletedBadge>Completed</CompletedBadge>}
  </ChapterItem>
))}

          </ChapterList>
        )}
      </Container>
    </ContainerWrapper>
  );
};

export default CourseDetails;