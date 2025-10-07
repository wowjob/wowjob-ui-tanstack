import { TanstackLink } from '@wowjob/ui-tanstack'
import { Flex, Text } from '@wowjob/ui'
import type { TStyle } from '@wowjob/css'

export const NavHeader = ({
  backLabel = 'Back',
  href,
  theme = 'brand',
  title,
  viewTransitionName,
}: {
  title: string
  viewTransitionName: string
  theme?: TStyle['theme']
  href: string
  backLabel?: string
}) => {
  return (
    <Flex
      mobile={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text as="h1">{title}</Text>

      <TanstackLink
        href={href}
        mobile={{
          viewTransitionName,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          padding: [8, 16],
          borderRadius: 8,
        }}
        theme={theme}
      >
        {backLabel}
      </TanstackLink>
    </Flex>
  )
}
