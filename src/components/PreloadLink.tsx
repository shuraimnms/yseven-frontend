import { Link, LinkProps } from 'react-router-dom';
import { ComponentType } from 'react';

interface PreloadLinkProps extends LinkProps {
  preloadComponent?: ComponentType<any> & { preload?: () => Promise<any> };
}

export function PreloadLink({ preloadComponent, onMouseEnter, onFocus, ...props }: PreloadLinkProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preloadComponent?.preload) {
      preloadComponent.preload();
    }
    onMouseEnter?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (preloadComponent?.preload) {
      preloadComponent.preload();
    }
    onFocus?.(e);
  };

  return (
    <Link
      {...props}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
    />
  );
}
