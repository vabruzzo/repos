import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import Button from "../../elements/Button";
import { saveRepo, removeRepo } from "../../../data/db";
import styles from "./RepoListItem.module.css";

type RepoListItemProps = {
  repo: {
    owner: string;
    repo: string;
    releaseName: string;
    releaseDate: string;
    releaseBody: string;
    newUpdate?: boolean;
  };
  setRepoList: any;
};

const RepoListItem: FC<RepoListItemProps> = ({
  repo: { owner, repo, releaseName, releaseDate, releaseBody, newUpdate },
  setRepoList,
}) => {
  const removeNewUpdate = () => {
    if (!newUpdate) {
      return;
    }

    const updatedRepoList = saveRepo(
      owner,
      repo,
      // @TODO(.5): remove the need to revert to the JSON payload naming convention
      { tag_name: releaseName, published_at: releaseDate, body: releaseBody },
      { newUpdate: false }
    );

    setRepoList(updatedRepoList);
  };

  const handleRemoveClick = () => {
    // @TODO(.5): move a new generateRepoKey function to utils to use here
    const repoKey = `${owner}/${repo}`;
    const updatedRepoList = removeRepo(repoKey);

    setRepoList(updatedRepoList);
  };

  return (
    <li className={styles.listItem}>
      <p>
        <b>
          {owner}/{repo}
        </b>{" "}
        {newUpdate && (
          <span className={styles.newUpdate}>
            <b> - NEW UPDATE!</b>
          </span>
        )}
      </p>
      <p>
        Latest release: {releaseName} - {releaseDate}
      </p>
      <details className={styles.details} onClick={removeNewUpdate}>
        <summary>Release Notes</summary>
        <ReactMarkdown children={releaseBody} />
      </details>
      <Button className={styles.remove} onClick={handleRemoveClick}>
        X
      </Button>
    </li>
  );
};

export default RepoListItem;
