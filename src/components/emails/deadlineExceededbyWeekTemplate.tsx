import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  name: string;
  jobName: string;
  link: string;
}

export const DeadlineExceededbyWeekTemplate = ({
  name,
  jobName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The deadline for the <strong>{jobName}</strong> job expired a week
        ago. The participants of the job would be expecting the results to be
        out soon — request you to publish the winners on Earn shortly!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the submissions.
      </p>
      <p style={styles.salutation}>Best,</p>
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
