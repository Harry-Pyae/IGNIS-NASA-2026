import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonStyles';
import { Icon, type IconName } from './Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  /** The guided-demo glow (2.6s). Use on ONE button per screen. */
  glow?: boolean;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  glow,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconSize = size === 'sm' ? 15 : 17;
  return (
    <button type={type} className={buttonClass(variant, size, cx(glow && 'anim-glow', className))} {...rest}>
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
