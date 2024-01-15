import { Locator } from '@playwright/test';

export const getStyle = async (element: Locator, propertyPass: string) => element.evaluate((el, property) => window.getComputedStyle(el).getPropertyValue(property), propertyPass);
