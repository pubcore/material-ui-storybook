import React, { useCallback } from "react";
import { Form } from "../";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";

var forms = {};
function useTestForm(Story, defaultValues = {}) {
  var single = useForm({ defaultValues });
  if (!forms[Story]) {
    forms[Story] = single;
  }
  return forms[Story];
}

export default function FormDecorator(
  Story,
  { args, parameters: { defaultValues = {} } }
) {
  args.form = useTestForm(Story, defaultValues);
  const { reset } = args.form;
  const onClick = useCallback(() => reset(), []);
  return (
    <Form onSubmit={args.form.handleSubmit((values) => console.log(values))}>
      <Story />
      <div>
        <Button {...{ onClick }} variant="outlined" size="small">
          reset
        </Button>
        &nbsp;
        <Button type="submit" color="primary">
          submit
        </Button>
      </div>
    </Form>
  );
}
