import React from 'react';
import styled from 'styled-components';

const colors = {
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  width: 800px;
  max-width: 90vw;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.darkBlue};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.mediumBlue};
    transform: scale(1.1);
  }
`;

const VideoTitle = styled.h3`
  color: ${colors.darkBlue};
  margin: 0 0 16px;
  font-size: 1.5em;
`;

const VideoContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: ${colors.darkBlue};
  border-radius: 8px;
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface VideoModalProps {
  levelNumber: number;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ levelNumber, onClose, videoUrl }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <VideoTitle>Refrigerator Level {levelNumber} Camera Feed</VideoTitle>
        <VideoContainer>
          <video 
            autoPlay 
            muted 
            controls
            src={videoUrl}
          />
        </VideoContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VideoModal; 