import React from 'react';

import { useField } from '@/components/FormProvider';

import { FormControl } from '../FormControl';
import { IFormControl } from '../types';
import {
  Circle, CircleFill, Item, ItemInner, Items,
} from './Radio.styled';

type Option = {
  extra?: React.ReactElement,
  label?: string;
  type: string;
};

type RadioProps = {
  options?: Option[],
} & IFormControl;

export function Radio({
  errors,
  label,
  name,
  options,
}: RadioProps) {
  const { setValue, value } = useField<{ type: string }>(name);

  const onSelectItem = (option: Option) => () => {
    if (value?.type === option.type) return;

    setValue({ ...value, type: option.type });
  };

  return (
    <FormControl name={name} errors={errors} label={label}>
      <Items>
        {options.map((option) => {
          const isSelected = value?.type === option.type;

          return (
            <Item key={option.type} $selected={isSelected} onClick={onSelectItem(option)}>
              <ItemInner>
                <Circle $selected={isSelected}>
                  {isSelected ? <CircleFill /> : null}
                </Circle>
                {option.label}
              </ItemInner>
              {option.extra}
            </Item>
          );
        })}
      </Items>
    </FormControl>
  );
}
