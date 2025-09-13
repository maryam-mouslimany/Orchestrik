import React from "react";
import Input from "../../../../../components/Input";
import SelectFilter from "../../../../../components/SelectFilter";
import MultipleSelectChip from "../../../../../components/MultipleSelectFilter";
import Button from "../../../../../components/Button";
import styles from "./styles.module.css";
import { useUserCreate } from "./hook";

const UserCreatePage: React.FC = () => {
  const {
    values,
    setField,
    creating,
    handleCreateClick,
    formError,
    roleOptions,
    positionOptions,
    skillsOptions,
    nameFormatBad,
    emailInvalid,
    passwordTooShort,
    confirmMismatch,
  } = useUserCreate();

  return (
    <div className={styles.form}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create User</h2>
      </div>

      {formError && <div className={styles.errorBanner}>{formError}</div>}

      <div className={styles.row}>
        <div className={styles.fieldWrap}>
          <Input
            label="Full name"
            placeholder="e.g., Jane Doe"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          {nameFormatBad && (
            <p className={styles.error}>Full name must include first and last name.</p>
          )}
        </div>

        <div className={styles.fieldWrap}>
          <Input
            label="Email"
            placeholder="name@example.com"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          {emailInvalid && <p className={styles.error}>Please enter a valid email.</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.fieldWrap}>
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
          />
          {passwordTooShort && (
            <p className={styles.error}>Password must be at least 6 characters.</p>
          )}
        </div>

        <div className={styles.fieldWrap}>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={values.confirm}
            onChange={(e) => setField("confirm", e.target.value)}
          />
          {confirmMismatch && <p className={styles.error}>Passwords do not match.</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.fieldWrap}>
          <SelectFilter
            label="Position"
            options={positionOptions}
            selected={values.position_id}
            onChange={(val) => setField("position_id", val)}
            placeholder="Select a position"
          />
        </div>

        <div className={styles.fieldWrap}>
          <SelectFilter
            label="Role"
            options={roleOptions}
            selected={values.role_id}
            onChange={(val) => setField("role_id", val)}
            placeholder="Select a role"
          />
        </div>
      </div>

      <div className={styles.fieldWrap}>
        <MultipleSelectChip
          label="Skills"
          options={skillsOptions}
          selected={values.skills}
          onChange={(next) => setField('skills', (next as number[]) || [])}
          placeholder="Select skills"
        />
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleCreateClick}
          disabled={creating}
          label={creating ? "Creating…" : "Create user"}
        />
      </div>
    </div>
  );
};

export default UserCreatePage;
