import styled from 'styled-components'

export const ContentContainer = styled.div`
  opacity: 0;
  animation: fadeIn 0.4s ease-in forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`

export const Tag = styled.button<{ $isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: ${props => props.$isSelected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.3)'};
  border: 1px solid ${props => props.$isSelected ? 'rgb(59, 130, 246)' : 'rgba(51, 65, 85, 0.5)'};
  color: ${props => props.$isSelected ? 'rgb(219, 234, 254)' : 'rgb(148, 163, 184)'};
  transition: all 0.2s ease-in-out;
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(59, 130, 246, 0.2)' : 'none'};

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgb(59, 130, 246);
  }
`

