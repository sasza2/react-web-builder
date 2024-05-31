import React, { useEffect, useState } from 'react';

import { FieldProvider, FormProvider, useFormCreator } from '@/components/FormProvider';
import { I18nProvider } from '@/components/I18nProvider';
import { SidebarProvider, useSidebarModalRef } from '@/components/SidebarProvider';
import { StoreProvider } from '@/store/StoreProvider';
import { StyleProvider } from '@/components/StyleProvider';
import { DEFAULT_PRESET_COLORS } from '@/consts';
import { ColorPicker } from './ColorPicker';
import { Color } from './Color';
import { CustomColors } from './CustomColors/CustomColors';
import { ColorPickerModal } from './ColorPickerModal';

export default { title: 'forms/Color' };

function MockSidebar() {
  const sidebarRef = useSidebarModalRef();

  return (
    <div ref={sidebarRef} />
  );
}

function Provider({ children }: React.PropsWithChildren) {
  return (
    <I18nProvider>
      <StoreProvider>
        <StyleProvider>
          <SidebarProvider>
            {children}
            <MockSidebar />
          </SidebarProvider>
        </StyleProvider>
      </StoreProvider>
    </I18nProvider>
  );
}

export function ColorStory() {
  return (
    <Provider>
      <Color color="#ff5531" />
    </Provider>
  );
}

export function CustomColorsStory() {
  const [color, setColor] = useState(DEFAULT_PRESET_COLORS[0]);
  const [colors, setColors] = useState(DEFAULT_PRESET_COLORS);

  const onChange = (nextValue: { color?: string, customColors?: string[] }) => {
    if (nextValue.color) setColor(nextValue.color);
    if (nextValue.customColors) setColors(nextValue.customColors);
  };

  return (
    <Provider>
      <CustomColors colors={colors} onChange={onChange} value={color} />
    </Provider>
  );
}

export function ColorPickerStory() {
  const [value, setValue] = useState();

  return (
    <Provider>
      <FieldProvider
        name="color"
        setValue={setValue}
        value={value}
      >
        <ColorPicker
          name="color"
        />
      </FieldProvider>
    </Provider>
  );
}

export function ColorPickerModalStory() {
  const formCreator = useFormCreator<Record<string, unknown>>(() => ({}));
  const [isSidebarRendered, setSidebarRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSidebarRendered(true);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <FormProvider {...formCreator}>
      <Provider>
        {
          isSidebarRendered && (
            <ColorPickerModal
              allowGradient
              name="color"
              isOpen
              label="Sketch story"
            />
          )
        }
      </Provider>
    </FormProvider>
  );
}
