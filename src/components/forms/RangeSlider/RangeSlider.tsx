import React, { useEffect, useRef, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { useTheme } from 'styled-components';

import { normalizeInt } from '@/utils/field';
import { FieldProvider, useField } from '@/components/FormProvider';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
import { Input } from '../Input';
import { InputContainer, RangeContainer, RangeSliderWithInput } from './RangerSlider.styled';

type RangeSliderProps = {
  max: number,
  min?: number,
  rightNode?: string,
} & IFormControl;

export function RangeSlider({
  name,
  errors,
  label,
  max,
  min,
  rightNode,
  testId,
}: RangeSliderProps) {
  const theme = useTheme();
  const { setValue, value } = useField<number>(name);
  const inputSize = `${max}`.length;

  const setValueRef = useRef<typeof setValue>();
  setValueRef.current = setValue;

  const [inputValue, setInputValue] = useState(`${value}`);

  const onInputSetValue = (nextInputValue: string) => {
    let valueInt = parseInt(nextInputValue, 10) || 0;
    if (valueInt < 0) valueInt = 0;
    else if (valueInt > max) valueInt = max;

    if (min !== undefined && valueInt < min) valueInt = min;
    setValueRef.current(valueInt);
    setInputValue(nextInputValue);
  };

  useEffect(() => { // TODO - check this
    const inputValueInt = parseInt(inputValue, 10) || 0;
    if (inputValueInt !== value) setInputValue(`${value}`);
  }, [inputValue, value]);

  return (
    <FormControl name={name} errors={errors} label={label}>
      <RangeSliderWithInput>
        <RangeContainer $fullWidth={!rightNode} $inputSize={inputSize}>
          <Range
            min={min}
            max={max}
            onChange={(valueNext: number[]) => {
              setValueRef.current(valueNext[0]);
            }}
            values={[value]}
            renderTrack={({ props, children }) => (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  height: '36px',
                  display: 'flex',
                  width: '100%',
                }}
              >
                <div
                  ref={props.ref}
                  style={{
                    height: '4px',
                    width: '100%',
                    borderRadius: '4px',
                    background: getTrackBackground({
                      values: [value],
                      colors: [theme.colors.darkBlue, theme.colors.lightGray],
                      min,
                      max,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.white,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: `0px 1px 3px 0px ${theme.colors.black}33`,
                  marginLeft: '10px',
                }}
              />
            )}
          />
        </RangeContainer>
        {
          rightNode && (
            <InputContainer $inputSize={inputSize}>
              <FieldProvider
                name="input"
                setValue={onInputSetValue}
                value={inputValue}
              >
                <Input
                  name="input"
                  rightNode={rightNode}
                  normalize={normalizeInt}
                  testId={testId ? `${testId}.input` : undefined}
                />
              </FieldProvider>
            </InputContainer>
          )
        }
      </RangeSliderWithInput>
    </FormControl>
  );
}
