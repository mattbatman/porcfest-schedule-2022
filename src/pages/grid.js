import React from 'react';
import { findIndex, uniq } from 'ramda';
import { Link } from 'gatsby';
import scheduleData from '../data/schedule.json';
import GridRow from '../components/GridRow';

const data = scheduleData.reduce((acc, cv) => {
  const Date = cv['Readable date'];
  const eventIndex = findIndex(
    (existingGroup) => existingGroup.date === Date,
    acc
  );

  if (eventIndex < 0) {
    const events = [];
    events.push(cv);

    acc.push({
      date: Date,
      events
    });

    return acc;
  }

  acc[eventIndex].events.push(cv);

  return acc;
}, []);

const locations = scheduleData.map((d) => d.Location);
const allUniqueLocations = uniq(locations);

const GridPage = () => {
  return (
    <main className="grid-page">
      <title>PorcFest Schedule 2022 | Grid</title>
      <h1>PorcFest Schedule 2022</h1>
      <p>
        This is an attempt to replicate the events from the main{' '}
        <a href="https://porcfest.com/schedule/">PorcFest schedule</a>.
      </p>
      <p>
        <Link to="/">List View</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th key="time"></th>
            {allUniqueLocations.map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <GridRow data={d} key={d.date} allLocations={allUniqueLocations} />
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default GridPage;
