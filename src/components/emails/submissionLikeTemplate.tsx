import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  name: string;
  jobName: string;
  link: string;
}

export const SubscribeLikeTemplate = ({
  name,
  jobName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        People are really digging your work on the <strong>{jobName}</strong>{' '}
        job. Keep it up!
      </p>
      <p style={styles.textWithMargin}>
        Check out the other submissions and spread some love to the other
        participants!
      </p>
      <a href={link} style={styles.link}>
        View Subscribes
      </a>
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
