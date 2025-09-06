
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
    className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="object-contain"
        sizes="40px"
      />
    </div>
  );
}
