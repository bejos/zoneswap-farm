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
  width: 80px;
  padding: 0 5px;
`

const SpinInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
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
            <img style={{ marginRight: 5, transform: 'translateY(5px)' }} alt="gouda" src={goudaIcon} height={20} width={20} />
            {displayBalance(max)}
          </Text>
        </Flex>
        <Flex alignItems="flex-end" justifyContent="space-around">
          <StyledInput
            pattern="^[0-9]*[,]?[0-9]*$"
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          <Button variant="secondary" scale="sm" onClick={onSelectMax} mr="8px">
            Max
          </Button>
          <Text fontSize="16px">{symbol}</Text>
        </Flex>
      </StyledTokenInput>
    </div>
  )
}

export default SpinInput