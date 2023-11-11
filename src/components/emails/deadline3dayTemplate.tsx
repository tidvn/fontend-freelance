import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  name: string;
  jobName: string;
  link: string;
}

export const DeadlineThreeDaysTemplate = ({
  name,
  jobName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Friendly reminder that the job &quot;
        <span style={{ fontWeight: 400 }}>{jobName}&quot;</span>you&nbsp;had
        indicated&nbsp;interest in will close in 3 days!{' '}
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to take another look.
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
