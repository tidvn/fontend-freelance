import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  name: string;
  jobName: string;
  link: string;
}

export const SubscribeCompanyTemplate = ({
  name,
  jobName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Your listing <strong>{jobName}</strong> just received a submission on
        FreLan! &mdash;{' '}
        <a href={link} style={styles.link}>
          check it out!
        </a>
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
