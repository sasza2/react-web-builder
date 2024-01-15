import React, { useCallback, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import { Tooltip } from 'react-tooltip';

import { Option } from 'types';
import { assignTestProp } from '@/utils/tests';
import { useField } from '@/components/FormProvider';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
import { Wrapped } from './Select.styled';

type SelectProps<T > = {
  label?: JSX.Element | string,
  size: 'xs' | 'lg',
  menuTooltip?: string,
  options: Option<T>[],
} & IFormControl;

export function Select<T>({
  name,
  errors,
  label,
  options,
  size = 'lg',
  menuTooltip,
  testId,
}: SelectProps<T>) {
  const { value, setValue } = useField<T>(name);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const onChange = useCallback((option: Option<T>) => {
    setValue(option.value);
  }, [options, setValue]);

  const option = useMemo(() => options.find((item) => item.value === value), [options, value]);

  const onMenuOpen = useCallback(() => setMenuIsOpen(true), []);

  const onMenuClose = useCallback(() => setMenuIsOpen(false), []);

  return (
    <FormControl name={name} errors={errors} label={label}>
      <Wrapped
        data-tooltip-id={`select-${name}`}
        $size={size}
        {...assignTestProp(testId)}
      >
        <ReactSelect
          className="react-select-container"
          classNamePrefix="react-select"
          value={option}
          onChange={onChange}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          menuIsOpen={menuIsOpen}
          options={options}
          isSearchable={false}
        />
      </Wrapped>
      {
        !menuIsOpen && menuTooltip && (
          <Tooltip id={`select-${name}`}>
            {menuTooltip}
          </Tooltip>
        )
      }
    </FormControl>
  );
}
