import React from 'react';

import { styles } from './styles';

interface Job {
  title: string;
  company: string;
  slug: string;
  rewardAmount: number | null;
}

interface TemplateProps {
  name: string;
  jobs: Job[] | undefined;
}

export const WeeklyRoundupTemplate = ({ name, jobs }: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey there, {name}!</p>
      <p style={styles.textWithMargin}>
        Here&apos;s a curated round-up of all live jobs, made just for you!
      </p>
      <ol style={styles.list}>
        {jobs?.map((job, i) => (
          <li key={i} style={styles.text}>
            <a
              href={`https://earn.superteam.fun/listings/jobs/${
                job?.slug || ''
              }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
              style={styles.link}
            >
              {job.title} by {job.company} ($
              {job.rewardAmount ?? 'Not specified'})
            </a>
          </li>
        ))}
      </ol>
      <p style={styles.salutation}>Go Secure the Bag,</p>
      <p style={styles.text}>The FreLan Crew 🦸‍♀️🦸‍♂️</p>
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
