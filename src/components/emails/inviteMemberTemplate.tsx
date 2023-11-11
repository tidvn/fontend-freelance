import React from 'react';

import { styles } from './styles';

interface TemplateProps {
  senderName: string;
  companyName: string;
  link: string;
}

export const InviteMemberTemplate = ({
  senderName,
  companyName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>
        You have been invited to join <strong>{companyName}</strong> {''}
        by {senderName}!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to get added as a team member of {companyName} on FreLan
      </p>
      <p style={styles.salutation}>Best,&nbsp;</p>
      <p style={styles.text}>The FreLan Crew 🦸&zwj;♀️🦸&zwj;♂️</p>
    </div>
  );
};
