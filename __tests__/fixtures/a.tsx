import { ActionSheet, Button } from '@ray-js/smart-ui';

export default () => {
  return (
    <Button
      title="hello"
      onClick={() => {
        console.log('hello');
      }}
    >
      <span>hello</span>
    </Button>
  );
}