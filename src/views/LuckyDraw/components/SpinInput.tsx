import React from 'react'
import styled from 'styled-components'
import { Button, Input, InputProps, Flex, Text } from '@cowswap/uikit'
import goudaIcon from '../icons/GOUDA.svg'

interface ModalInputProps {
  max: string
  symbol: string
  onSelectMax?: () => void
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  inputTitle?: string
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning
  }

  return theme.shadows.inset
}

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 12px;
  width: 100%;
`

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 120px;
  padding: 0 5px;
`

const SpinInput: React.FC<ModalInputProps> = ({
  max,
  onChange,
  onSelectMax,
  value,
}) => {
  const isBalanceZero = max === '0' || !max

  const displayBalance = (balance: string) => {
    if (isBalanceZero) {
      return '0'
    }
    const balanceNumber = Number(balance)
    if (balanceNumber > 0 && balanceNumber < 0.0001) {
      return balanceNumber.toLocaleString(undefined, { maximumFractionDigits: 20 })
    }
    return balanceNumber.toLocaleString()
  }

  return (
    <div style={{ position: 'relative' }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between">
          <Text fontSize="14px">Times</Text>
          <Text fontSize="14px">
            {displayBalance(max)}
          </Text>
        </Flex>
        <Flex alignItems="baseline" justifyContent="space-between">
          <StyledInput
            pattern="^[0-9]*[,]?[0-9]*$"
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Button variant="subtle" scale="sm" onClick={onSelectMax} mr="8px">
            Max
          </Button>
          <img style={{ marginRight: 5, transform: 'translateY(5px)' }} alt="gouda" src={goudaIcon} height={20} width={20} />
        </Flex>
      </StyledTokenInput>
    </div>
  )
}

export default SpinInput