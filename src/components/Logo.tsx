
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src="/newfavicon.ico"
        alt="Logo"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 10vw, 5vw"
        priority
      />
    </div>
  );
}
