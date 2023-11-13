import React from 'react';

import { styles } from './styles';

interface SubscribeProps {
  name: string;
  jobName: string;
  personName: string;
  link: string;
}

export const CommentSubscribeTemplate = ({
  name,
  jobName,
  personName,
  link,
}: SubscribeProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} left a new comment on your submission to the
        <strong>{jobName}</strong> listing.
        <a href={link} style={styles.link}>
          See what they said.
        </a>{' '}
      </p>
      <p style={styles.salutation}>Best,&nbsp;</p>
      <p style={styles.text}>The FreLan Crew 🦸&zwj;♀️🦸&zwj;♂️</p>
      <p style={styles.unsubscribe}>
        Click{' '}
        <a
          href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
          style={styles.unsubscribeLink}
        >
          here
        </a>{' '}
        to unsubscribe from all emails from FreLan.
      </p>
    </div>
  );
};
