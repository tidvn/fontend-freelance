import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  name: string;
  jobName: string;
  link: string;
}

export const WinnersAnnouncedTemplate = ({
  name,
  jobName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The winners for the job <strong>{jobName}</strong> have been
        announced!{' '}
        <p style={styles.text}>
          <a href={link} style={styles.link}>
            Click here
          </a>{' '}
          to see who claimed the top spots.
        </p>
      </p>
      <p style={styles.text}>Best,&nbsp;</p>
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
