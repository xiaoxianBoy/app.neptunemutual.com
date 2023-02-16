import { useState } from 'react'

import { t, Trans } from '@lingui/macro'
import { CalculatorCardTitle } from '@/src/modules/analytics/CalculatorCardTitle'
import { classNames } from '@/utils/classnames'
import { useWeb3React } from '@web3-react/core'

import { useAppConstants } from '@/src/context/AppConstants'
import { PolicyCalculation } from '@/src/modules/analytics/PolicyCalculation'
import { DateRangePicker } from '@/src/modules/analytics/DateRangePicker'
import { CoverOptions } from '@/src/modules/analytics/CoverOptions'
import { CalculatorAmountHandler } from '@/src/modules/analytics/CalculatorAmountHandler'
import { InputLabel } from '@/src/modules/analytics/InputLabel'
import { calculateCoverPolicyFee } from '@/utils/calculateCoverPolicyFee'

export const CalculatorCard = ({ approving, purchasing }) => {
  const { library, account } = useWeb3React()

  const {
    liquidityTokenDecimals,
    liquidityTokenSymbol
  } = useAppConstants()

  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')

  function handleChange (val) {
    setError('')
    setAmount(val)
  }

  const buttonBg = 'bg-5D52DC'
  const setSortType = ''

  const [coverMonth, setCoverMonth] = useState('')

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value)
  }

  const [selectedCover, setSelectedCover] = useState({})
  const [loadingFeeData, setLoadingFeeData] = useState(false)
  const [feeData, setFeeData] = useState(null)

  const calculatePolicyFee = async () => {
    setLoadingFeeData(true)
    setFeeData(null)
    const payload = {
      value: amount,
      coverMonth: coverMonth,
      coverKey: selectedCover.coverKey,
      productKey: selectedCover.productKey,
      liquidityTokenDecimals
    }
    try {
      const data = await calculateCoverPolicyFee({ library, account, ...payload })
      setFeeData(data)
    } catch (err) {
    } finally {
      setLoadingFeeData(false)
    }
  }

  return (
    <>
      <div className='pb-4 lg:pb-6'>
        <CalculatorCardTitle text='Calculator ' />
      </div>
      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Select a cover' />
        <CoverOptions className='z-60' selected={selectedCover} setSelected={setSelectedCover} setSortType={setSortType} />
      </div>

      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Amount you wish to cover' />
        <CalculatorAmountHandler
          error={error}
          value={amount}
          buttonProps={{
            children: t`Max`,
            onClick: () => {},
            disabled: approving || purchasing,
            buttonClassName: 'hidden'
          }}
          unit={liquidityTokenSymbol}
          inputProps={{
            id: 'cover-amount',
            disabled: approving || purchasing,
            placeholder: t`Enter Amount`,
            value: amount,
            onChange: handleChange,
            allowNegativeValue: false
          }}
        />
      </div>
      <div className='pb-4 lg:pb-6'>
        <InputLabel label='Set expiry' />
        <DateRangePicker handleRadioChange={handleRadioChange} coverMonth={coverMonth} approving={approving} purchasing={purchasing} />
      </div>

      <div className='pb-6 lg:pb-10'>
        <button
          type='button'
          disabled={amount === '' || coverMonth === ''}
          className={classNames(
            'block w-full pt-3 pb-3 uppercase px-4 py-0 text-sm font-semibold tracking-wider leading-loose text-white border border-transparent rounded-md whitespace-nowrap hover:bg-opacity-75',
            buttonBg,
            amount === '' || coverMonth === '' ? 'cursor-not-allowed disabled:opacity-75' : ''
          )}
          title={t`Calculate policy fee`}
          onClick={calculatePolicyFee}
        >
          <span className='sr-only'>{t`Calculate policy fee`}</span>
          <Trans>Calculate policy fee</Trans>
        </button>
      </div>
      <PolicyCalculation loadingFeeData={loadingFeeData} feeData={feeData} />
    </>
  )
}
