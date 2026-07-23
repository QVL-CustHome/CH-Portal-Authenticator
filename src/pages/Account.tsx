import { Button, Feedback, Spinner, useTranslation } from "canopui";
import AuthPageContent from "../components/AuthPageContent";
import ProfileDetails from "../components/ProfileDetails";
import { useAccount } from "../hooks/useAccount";

export default function Account() {
  const { t } = useTranslation();
  const { me, error, signOut } = useAccount();

  return (
    <AuthPageContent title={t("auth.account.title")}>
      {error ? (
        <Feedback severity="error">{error}</Feedback>
      ) : !me ? (
        <Spinner label={t("auth.loading")} />
      ) : (
        <>
          <ProfileDetails me={me} />
          <Button variant="accent" onClick={signOut}>
            {t("auth.account.logout")}
          </Button>
        </>
      )}
    </AuthPageContent>
  );
}
