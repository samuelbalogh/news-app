import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulseRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
`;

const NeonRing = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #ff00ff;
  animation: 
    ${pulseRing} 1.5s infinite,
    ${fadeInOut} 0.5s ease-in forwards;
  box-shadow: 0 0 20px #ff00ff, inset 0 0 20px #ff00ff;
  opacity: 0;
`;

// glitch text
const glitchEffect = keyframes`
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff,
                 0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff,
                 -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff,
                 0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff,
                 -0.04em -0.025em 0 #fffc00;
  }
`;

const GlitchText = styled.div`
  font-size: 2rem;
  font-family: 'Courier New', monospace;
  color: #fff;
  animation: ${glitchEffect} 1s infinite;
  opacity: 0;
  animation: 
    ${glitchEffect} 1s infinite,
    ${fadeInOut} 0.5s ease-in forwards;
`;

// data stream
const dataStream = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const DataStreamContainer = styled.div`
  width: 100px;
  height: 100px;
  overflow: hidden;
  background: #000;
  position: relative;
  opacity: 0;
  animation: ${fadeInOut} 0.5s ease-in forwards;
`;

const StreamLine = styled.div<{ $left: number; $delay: number }>`
  position: absolute;
  width: 2px;
  height: 100%;
  background: #0ff;
  box-shadow: 0 0 10px #0ff;
  animation: ${dataStream} 1s infinite;
  left: ${props => props.$left}px;
  animation-delay: ${props => props.$delay}s;
`;

// hexagon grid
const hexPulse = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.3;
  }
`;

const HexGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 30px);
  gap: 5px;
  opacity: 0;
  animation: ${fadeInOut} 0.5s ease-in forwards;
`;

const Hexagon = styled.div<{ $delay: number }>`
  width: 30px;
  height: 34.64px;
  background: #00ff00;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: ${hexPulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
  box-shadow: 0 0 15px #00ff00;
`;

// circuit paths
const circuitFlow = keyframes`
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const CircuitSVG = styled.svg`
  width: 100px;
  height: 100px;
  opacity: 0;
  animation: ${fadeInOut} 0.5s ease-in forwards;
  
  path {
    stroke: #00ffff;
    stroke-width: 2;
    fill: none;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${circuitFlow} 3s infinite linear;
    filter: drop-shadow(0 0 5px #00ffff);
  }
`;

const LOADER_COMPONENTS = {
  neonRing: () => <NeonRing />,
  glitchText: () => <GlitchText>loading...</GlitchText>,
  dataStream: () => (
    <DataStreamContainer>
      {Array.from({ length: 5 }, (_, i) => (
        <StreamLine key={i} $left={i * 20} $delay={i * 0.2} />
      ))}
    </DataStreamContainer>
  ),
  hexGrid: () => (
    <HexGrid>
      {Array.from({ length: 9 }, (_, i) => (
        <Hexagon key={i} $delay={i * 0.1} />
      ))}
    </HexGrid>
  ),
  circuitPaths: () => (
    <CircuitSVG viewBox="0 0 100 100">
      <path d="M10,50 L30,50 L40,30 L60,70 L70,50 L90,50" />
      <path d="M10,30 L90,30" />
      <path d="M10,70 L90,70" />
    </CircuitSVG>
  ),
};

type LoaderKey = keyof typeof LOADER_COMPONENTS;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  opacity: 0;
  animation: ${fadeInOut} 0.5s ease-in forwards;
`;

export const RandomCyberpunkLoader = () => {
  const [selectedLoader, setSelectedLoader] = useState<LoaderKey>();

  useEffect(() => {
    const loaders = Object.keys(LOADER_COMPONENTS) as LoaderKey[];
    const randomLoader = loaders[Math.floor(Math.random() * loaders.length)];
    setSelectedLoader(randomLoader);
  }, []);

  if (!selectedLoader) return null;

  const LoaderComponent = LOADER_COMPONENTS[selectedLoader];
  return (
    <LoaderWrapper>
      <LoaderComponent />
    </LoaderWrapper>
  );
};

export const CyberpunkLoaders = () => {
  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h3>neon ring</h3>
        <NeonRing />
      </div>

      <div>
        <h3>glitch text</h3>
        <GlitchText>loading...</GlitchText>
      </div>

      <div>
        <h3>data stream</h3>
        <DataStreamContainer>
          {Array.from({ length: 5 }, (_, i) => (
            <StreamLine key={i} $left={i * 20} $delay={i * 0.2} />
          ))}
        </DataStreamContainer>
      </div>

      <div>
        <h3>hex grid</h3>
        <HexGrid>
          {Array.from({ length: 9 }, (_, i) => (
            <Hexagon key={i} $delay={i * 0.1} />
          ))}
        </HexGrid>
      </div>

      <div>
        <h3>circuit paths</h3>
        <CircuitSVG viewBox="0 0 100 100">
          <path d="M10,50 L30,50 L40,30 L60,70 L70,50 L90,50" />
          <path d="M10,30 L90,30" />
          <path d="M10,70 L90,70" />
        </CircuitSVG>
      </div>
    </div>
  );
};