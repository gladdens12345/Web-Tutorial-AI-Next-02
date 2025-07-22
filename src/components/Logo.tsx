import Image from 'next/image';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 20 },
    md: { icon: 48, text: 28 },
    lg: { icon: 64, text: 36 }
  };

  const currentSize = sizes[size];

  if (variant === 'icon-only') {
    return (
      <Image
        src="/placeholder-icon.svg"
        alt="Web Tutorial AI"
        width={currentSize.icon}
        height={currentSize.icon}
        className={className}
      />
    );
  }

  return (
    <div className={`flex items-center ${variant === 'vertical' ? 'flex-col' : 'gap-3'} ${className}`}>
      <Image
        src="/placeholder-icon.svg"
        alt="Web Tutorial AI Icon"
        width={currentSize.icon}
        height={currentSize.icon}
        className="flex-shrink-0"
      />
      <div className={variant === 'vertical' ? 'text-center mt-2' : ''}>
        <h1 
          className="font-bold leading-tight tracking-tight"
          style={{ fontSize: `${currentSize.text}px` }}
        >
          Web Tutorial
          <span className="text-blue-600 ml-1">AI</span>
        </h1>
      </div>
    </div>
  );
}