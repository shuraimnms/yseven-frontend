import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScrollBehavior } from '@/hooks/use-scroll-to-top';

interface NavigationLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavigationLink = ({ to, children, className, onClick }: NavigationLinkProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const behavior = getScrollBehavior(to);
    
    // Execute any additional onClick logic
    if (onClick) {
      onClick();
    }
    
    // Navigate to the route
    navigate(to);
    
    // Scroll to top with appropriate behavior
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior,
      });
    }, 0);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default NavigationLink;