import React from 'react';

import { OnImageUpload, WebBuilderComponentProperty } from 'types';
import { assignTestProp } from '@/utils/tests';
import { ColorPicker } from '../forms/ColorPicker';
import { Input } from '../forms/Input';
import { RichText } from '../forms/RichText';
import { RangeSlider } from '../forms/RangeSlider';
import { Toggle } from '../forms/Toggle';
import { Select } from '../forms/Select/Select';
import { FormGroup, FormHeader } from '../forms/FormControl.styled';
import { About } from '../forms/About';
import { Padding } from '../forms/Padding';
import { Border } from '../forms/Border';
import { ListOrder } from '../forms/ListOrder';
import { FontOptions } from '../forms/FontOptions';
import { InputHTML } from '../forms/InputHTML';
import { URLInput } from '../forms/URLInput';
import { ImageUpload } from '../forms/ImageUpload';
import { BoxShadow } from '../forms/BoxShadow';
import { OpenContainer } from '../forms/OpenContainer';
import { EditBreakpointField } from '../forms/EditBreakpointField';
import { BreakpointHeight } from '../forms/BreakpointHeight';

type FormPropertyProps = {
  autoFocus?: boolean,
  defaultValue?: unknown,
  formCreatorId: string,
  onImageUpload?: OnImageUpload,
  prop: WebBuilderComponentProperty,
  testId?: string,
  name: string,
};

export function FormProperty({
  autoFocus,
  defaultValue,
  formCreatorId,
  onImageUpload,
  prop,
  testId = 'formProperty',
  name,
}: FormPropertyProps) {
  if (prop.type === 'fontOptions') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <FontOptions
          name={name}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'list') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <ListOrder
          name={name}
          options={prop.options}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'padding') {
    return (
      <Padding
        name={name}
        testId={testId}
      />
    );
  }
  if (prop.type === 'border') {
    return (
      <Border
        name={name}
        testId={testId}
      />
    );
  }
  if (prop.type === 'boxShadow') {
    return (
      <BoxShadow
        name={name}
        testId={testId}
      />
    );
  }
  if (prop.type === 'select') {
    return (
      <Select
        name={name}
        label={prop.label}
        size="lg"
        options={prop.options}
      />
    );
  }
  if (prop.type === 'richtext') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <RichText
          key={formCreatorId}
          autoFocus={autoFocus}
          colorAvailable={prop.colorAvailable}
          hyperlinkAvailable={prop.hyperlinkAvailable}
          name={name}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'html') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <InputHTML
          name={name}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'text') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <Input
          name={name}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'url') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <URLInput
          name={name}
          canOpenInNewTab={prop.canOpenInNewTab}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'color') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <ColorPicker
          allowGradient
          closeOnlyOnClickOutsideSidebarModal
          name={name}
          defaultValue={defaultValue as string}
          sketchLabel={prop.label}
          testId={name}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'number') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <RangeSlider
          name={name}
          min={prop.min}
          max={prop.max || 20}
          rightNode="px"
        />
      </FormGroup>
    );
  }
  if (prop.type === 'toggle') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <Toggle name={name} />
      </FormGroup>
    );
  }
  if (prop.type === 'openContainer') {
    return <OpenContainer {...prop} testId={testId} />;
  }
  if (prop.type === 'breakpointHeight') {
    return <BreakpointHeight name={name} {...prop} testId={testId} />;
  }
  if (prop.type === 'editBreakpoint') {
    return <EditBreakpointField {...prop} testId={testId} />;
  }
  if (prop.type === 'about') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <About
          button={prop.button}
          description={prop.description}
        />
      </FormGroup>
    );
  }
  if (prop.type === 'img') {
    return (
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        { onImageUpload && (
          <ImageUpload
            name={name}
            onImageUpload={onImageUpload}
          />
        ) }
      </FormGroup>
    );
  }
  return null;
}
