module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-pseudo-class-no-unknown': null,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'property-no-unknown': null
  }
};
