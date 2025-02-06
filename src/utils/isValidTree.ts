import { Tree } from 'types';

type Errors = {
  error: string;
  field: string;
};

const INTEGER_FIELDS = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'w'] as const;

export const isValidTree = (tree: Tree): boolean | Errors[] => {
  const errors: Errors[] = [];

  const traverseTree = (node: Tree, field: string = 'template') => {
    if (!node) {
      errors.push({
        error: 'FIELD_NOT_EXIST',
        field,
      });
      return;
    }

    if (!node.id) {
      errors.push({
        error: 'FIELD_DOESNT_EXIST',
        field: `${field}.id`,
      });
    }

    INTEGER_FIELDS.forEach((subField) => {
      if (!Number.isInteger(node[subField])) {
        errors.push({
          error: 'FIELD_IS_NOT_A_NUMBER',
          field: `${field}.${subField}`,
        });
      }
    });

    if (node.type === 'component') {
      const { element } = node;

      if (!element) {
        errors.push({
          error: 'FIELD_DOESNT_EXIST',
          field: `${field}.element`,
        });
        return;
      }

      if (!element.componentName) {
        errors.push({
          error: 'FIELD_DOESNT_EXIST',
          field: `${field}.element.componentName`,
        });
      }

      if (!element.id) {
        errors.push({
          error: 'FIELD_DOESNT_EXIST',
          field: `${field}.element.id`,
        });
      }

      if (!Array.isArray(element.props)) {
        errors.push({
          error: 'ELEMENT_PROPS_ARE_NOT_ARRAY',
          field: `${field}.element.props`,
        });
      }

      return;
    }

    if (!['column', 'fixed', 'row'].includes(node.type)) {
      errors.push({
        error: 'UNKNOWN_TYPE',
        field: `${field}.type`,
      });

      return;
    }

    if (!Array.isArray(node.children)) {
      errors.push({
        error: 'CHILDREN_ARE_NOT_ARRAY',
        field: `${field}.children`,
      });
      return;
    }

    if (node.type === 'column') {
      let sumOfWInChildren = 0;

      node.children.forEach((child) => {
        sumOfWInChildren += (Math.floor(child.marginLeft + child.marginRight + child.w) || 0);
      });

      if (sumOfWInChildren > node.w) {
        errors.push({
          error: 'SUM_OF_MARGIN_LEFT_AND_RIGHT_AND_W_IN_CHILDREN_IS_BIGGER_THAN_PARENT',
          field: `${field}.children`,
        });
      }
    } else if (node.type === 'row') {
      node.children.forEach((child, childIndex) => {
        if ((Math.floor(child.marginLeft + child.marginRight + child.w) || 0) > node.w) {
          errors.push({
            error: 'SUM_OF_MARGIN_LEFT_AND_RIGHT_AND_W_IN_CHILD_IS_BIGGER_THAN_PARENT',
            field: `${field}.children[${childIndex}]`,
          });
        }
      });
    }

    node.children.forEach((child, index) => {
      traverseTree(child, `${field}.children[${index}]`);
    });
  };

  traverseTree(tree);

  if (errors.length) return errors;

  return true;
};
