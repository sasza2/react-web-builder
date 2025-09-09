import React from 'react';
import type { OnImageUpload, WebBuilderComponentProperty } from 'types';

import { assignTestProp } from '@/utils/tests';

import { About } from '../forms/About';
import { FormArray } from '../forms/Array';
import { BackgroundImage } from '../forms/BackgroundImage';
import { Border } from '../forms/Border';
import { BoxShadow } from '../forms/BoxShadow';
import { BreakpointHeight } from '../forms/BreakpointHeight';
import { ColorPicker } from '../forms/ColorPicker';
import { EditBreakpointField } from '../forms/EditBreakpointField';
import { FontFamily } from '../forms/FontFamily';
import { FontOptions } from '../forms/FontOptions';
import { FormGroup, FormHeader } from '../forms/FormControl.styled';
import { ImageUpload } from '../forms/ImageUpload';
import { Input } from '../forms/Input';
import { InputHTML } from '../forms/InputHTML';
import { ListOrder } from '../forms/ListOrder';
import { FormObject } from '../forms/Object';
import { OpenContainer } from '../forms/OpenContainer';
import { Padding } from '../forms/Padding';
import { RangeSlider } from '../forms/RangeSlider';
import { RichText } from '../forms/RichText';
import { Select } from '../forms/Select/Select';
import { Toggle } from '../forms/Toggle';
import { URLInput } from '../forms/URLInput';

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
  if (prop.type === 'fontFamily') {
    return (
      <FontFamily />
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
  if (prop.type === 'backgroundImage') {
    return (
      <BackgroundImage
        name={name}
        onImageUpload={onImageUpload}
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
      <FormGroup {...assignTestProp(testId, null, prop.type)}>
        <FormHeader>
          {prop.label}
        </FormHeader>
        <Select
          name={name}
          size="lg"
          options={prop.options}
        />
      </FormGroup>
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
          leftNode={prop.leftNode}
          label={prop.description}
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
  if (prop.type === 'array') {
    return (
      <FormArray
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        formCreatorId={formCreatorId}
        of={prop.of}
        onImageUpload={onImageUpload}
        testId={testId}
        label={prop.label}
        name={name}
      />
    );
  }
  if (prop.type === 'object') {
    return (
      <FormObject
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        formCreatorId={formCreatorId}
        of={prop.of}
        onImageUpload={onImageUpload}
        testId={testId}
        label={prop.label}
        name={name}
      />
    );
  }
  return null;
}
