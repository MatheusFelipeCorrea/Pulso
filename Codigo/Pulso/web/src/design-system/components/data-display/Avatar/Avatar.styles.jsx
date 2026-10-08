import { cva } from 'class-variance-authority'

export const avatarVariants = cva('ds-avatar', {
    variants: {
        size: {
            xs: 'ds-avatar--xs',
            sm: 'ds-avatar--sm',
            md: 'ds-avatar--md',
            lg: 'ds-avatar--lg',
            xl: 'ds-avatar--xl',
        },
    },
    defaultVariants: { size: 'md' },
})

export const avatarStatusVariants = cva(
    'absolute rounded-full border-2 border-[var(--ds-color-background)]',
    {
        variants: {
            status: {
                online: 'bg-[var(--ds-color-success)]',
                busy: 'bg-[var(--ds-color-warning)]',
                offline: 'bg-[var(--ds-color-text-secondary)]',
            },
            size: {
                xs: 'bottom-0 right-0 h-1.5 w-1.5',
                sm: 'bottom-0 right-0 h-2 w-2',
                md: 'bottom-0 right-0 h-2.5 w-2.5',
                lg: 'bottom-0.5 right-0.5 h-3 w-3',
                xl: 'bottom-1 right-1 h-3.5 w-3.5',
            },
        },
        defaultVariants: { status: 'online', size: 'md' },
    }
)
