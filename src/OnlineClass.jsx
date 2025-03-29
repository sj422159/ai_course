import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const shine = keyframes`
  0% {
    top: -100%;
    left: -100%;
  }
  100% {
    top: 100%;
    left: 100%;
  }
`;

const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1f1f3a 100%);
  overflow: hidden;
  position: relative;
`;

const GlowingOrb = styled.div`
  position: absolute;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(243, 156, 18, 0.2) 0%, rgba(243, 156, 18, 0) 70%);
  filter: blur(40px);
  top: -10%;
  right: -5%;
  z-index: 0;
`;

const GlowingOrbBottom = styled(GlowingOrb)`
  background: radial-gradient(circle, rgba(72, 52, 212, 0.2) 0%, rgba(72, 52, 212, 0) 70%);
  top: auto;
  right: auto;
  bottom: -15%;
  left: -5%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 30px;
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: rgba(30, 30, 46, 0.85);
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(243, 156, 18, 0.1) 45%,
      rgba(243, 156, 18, 0.1) 55%,
      transparent 60%
    );
    transform: rotate(45deg);
    animation: ${shine} 10s infinite linear;
    z-index: -1;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  padding-right: 30px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(243, 156, 18, 0.5) rgba(30, 30, 46, 0.5);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 46, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(243, 156, 18, 0.5);
    border-radius: 3px;
  }
`;

const RightPanel = styled.div`
  flex: 2;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  scrollbar-width: thin;
  scrollbar-color: rgba(243, 156, 18, 0.5) rgba(30, 30, 46, 0.5);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 30, 46, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(243, 156, 18, 0.5);
    border-radius: 3px;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 20px;
  font-weight: 800;
  background: linear-gradient(90deg, #f39c12, #f1c40f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(243, 156, 18, 0.3);
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const VideoContainer = styled.div`
  width: 100%;
  background: #000;
  margin-bottom: 25px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  position: relative;
  transition: transform 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out 0.4s both;
  aspect-ratio: 16 / 9;
  max-height: 40vh;
  
  &:hover {
    transform: scale(1.01);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextContent = styled.div`
  font-size: 1.1rem;
  color: #e0e0e0;
  margin-bottom: 20px;
  line-height: 1.6;
  letter-spacing: 0.3px;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #f39c12;
  flex-grow: 1;
  animation: ${fadeIn} 0.6s ease-out 0.8s both;
`;

const InputContainer = styled.div`
  position: relative;
  margin-top: 15px;
  animation: ${fadeIn} 0.6s ease-out 0.8s both;
`;

const Input = styled.textarea`
  width: 100%;
  padding: 15px;
  margin-top: 5px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(42, 42, 66, 0.7);
  color: #fff;
  resize: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  height: 100px;
  
  &:focus {
    outline: none;
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 12px 24px;
  background: linear-gradient(90deg, #f39c12, #f1c40f);
  border: none;
  border-radius: 12px;
  color: #121212;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
  animation: ${fadeIn} 0.6s ease-out 1s both;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
    background: linear-gradient(90deg, #e67e22, #f39c12);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const BackButton = styled(Button)`
  background: linear-gradient(90deg, #333, #555);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 25px;
  animation: ${fadeIn} 0.6s ease-out 0.1s both;
  
  &:hover {
    background: linear-gradient(90deg, #444, #666);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 10px;
  margin-top: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out 0.4s both;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #f39c12;
    margin-right: 10px;
    border-radius: 50%;
  }
`;

const ProgressContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  position: relative;
  height: 12px;
  animation: ${fadeIn} 0.6s ease-out 0.6s both;
`;

const progressAnimation = (width) => keyframes`
  from { width: 0; }
  to { width: ${width}%; }
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, #f39c12, #f1c40f);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  animation: ${props => progressAnimation(props.progress)} 1s ease-out forwards;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 2s infinite;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  animation: ${fadeIn} 0.6s ease-out 0.7s both;
`;

const ModulesList = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ModuleItem = styled.div`
  padding: 10px 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid ${props => props.active ? '#f39c12' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease-out ${props => 0.6 + (props.index * 0.1)}s both;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(3px);
  }
`;



const OnlineClass = () => {
  const { courseTitle, chapterTitle } = useParams();
  const navigate = useNavigate();

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [doubt, setDoubt] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseTitle || !chapterTitle) {
      setError("Invalid course or chapter title.");
      setLoading(false);
      return;
    }

    const decodedChapterTitle = decodeURIComponent(chapterTitle);

    const fetchChapterData = async () => {
      setLoading(true);
      setError("");

      try {
        const requestData = { courseTitle, chapterTitle: decodedChapterTitle };

        const response = await fetch("http://127.0.0.1:8000/api/chapter-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chapter content.");
        }

        const responseData = await response.json();
        if (!responseData?.data?.generated_content) {
          throw new Error("Content not found.");
        }

        setSelectedChapter({
          title: decodedChapterTitle,
          generated_content: responseData.data.generated_content,
        });
      } catch (error) {
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [courseTitle, chapterTitle]);

  const handleDoubtSubmit = () => {
    if (doubt.trim()) {
      alert("Your question has been submitted to the instructor.");
      setDoubt("");
    } else {
      alert("Please enter a question before submitting.");
    }
  };

  return (
    <ContainerWrapper>
      <GlowingOrb />
      <GlowingOrbBottom />
      <Container>
        <LeftPanel>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          <Title>{selectedChapter ? selectedChapter.title : "Loading..."}</Title>

          <SectionTitle>Module Progress</SectionTitle>
          <ProgressContainer>
            <ProgressBar progress={progress} />
          </ProgressContainer>
          <ProgressInfo>
            <span>{progress}% Complete</span>
          </ProgressInfo>

          <TextContent>
            {loading ? "Loading content..." : error ? <span>{error}</span> : selectedChapter?.generated_content || "No content found."}
          </TextContent>
        </LeftPanel>

        <RightPanel>
          <VideoContainer>
            <video width="100%" height="100%" controls>
              <source src="sample-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </VideoContainer>

          <SectionTitle>Ask Your Instructor</SectionTitle>
          <InputContainer>
            <Input rows="3" placeholder="Type your question here..." value={doubt} onChange={(e) => setDoubt(e.target.value)} />
          </InputContainer>
          <Button onClick={handleDoubtSubmit}>Submit Question</Button>
        </RightPanel>
      </Container>
    </ContainerWrapper>
  );
};









export default OnlineClass;