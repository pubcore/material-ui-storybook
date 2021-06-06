import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Snackbar,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { A } from "../";
import { Alert } from "@material-ui/lab";

export default function Login({ login }) {
  const { t } = useTranslation(),
    [showPw, toggleShowPw] = useState(false),
    [errorText, setError] = useState(""),
    {
      register,
      handleSubmit,
      formState: { errors = {}, isSubmitting },
    } = useForm(),
    submit = async (form) => {
      const { textkey, severity } = await login(form);
      if (severity != "success") {
        setError(t(textkey || "login_error"));
      }
    };
  return (
    <Form onSubmit={handleSubmit(submit)} noValidate>
      <Legend>
        <h1>{t("login_please")}</h1>
        {t("register_please", "No account?")}
        &nbsp;<A href={registerUri}>{t("register")}</A>
      </Legend>
      <TextField
        {...{
          ...register("username", {
            required: t("username_required"),
          }),
          type: "text",
          label: t("username"),
          autoComplete: "username",
          error: Boolean(errors?.username),
          helperText: errors?.username?.message || " ",
        }}
      />
      <FormControl
        {...{
          variant: "outlined",
          error: Boolean(errors?.password),
        }}
      >
        <InputLabel htmlFor="current-password">{t("password")}</InputLabel>
        <OutlinedInput
          {...{
            id: "current-password",
            ...register("password", { required: t("password_required") }),
            type: showPw ? "text" : "password",
            autoComplete: "current-password",
            endAdornment: (
              <InputAdornment position="end" title={t("password_visibility")}>
                <IconButton
                  aria-label={t("password_visibility")}
                  onClick={handleEvent(() => toggleShowPw(!showPw))}
                  onMouseDown={handleEvent()}
                  edge="end"
                >
                  {showPw ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            labelWidth: 70,
          }}
        />
        <FormHelperText {...{ error: Boolean(errors?.password) }}>
          {errors?.password?.message || " "}
        </FormHelperText>
      </FormControl>
      <Button
        {...{
          type: "submit",
          color: "primary",
          disabled: isSubmitting,
        }}
      >
        {t("login")}
      </Button>
      {errorText && (
        <Snackbar
          {...{
            open: true,
            autoHideDuration: 5000,
          }}
        >
          <Alert {...{ onClose: () => setError("") }} severity="error">
            {errorText}
          </Alert>
        </Snackbar>
      )}
    </Form>
  );
}

const handleEvent = (handler) => (event) => {
  event.preventDefault();
  handler && handler();
};

const Form = styled.form`
  ${({ theme: { spacing } }) => `  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 300px;
  margin: ${spacing(2)}px;
  `}
`;

const Legend = styled.legend`
  padding-bottom: 20px;
`;

const registerUri = "https://localhost";
