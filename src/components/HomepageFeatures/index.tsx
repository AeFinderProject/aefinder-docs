import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fast Indexing',
    Svg: require('@site/static/img/img_02.svg').default,
    description: (
      <>
        With AeFinder's advanced indexing infrastructure
        data is efficiently retrieved from blockchain and
        delivered to dApps.
      </>
    ),
  },
  {
    title: 'Minimal Costs',
    Svg: require('@site/static/img/img_03.svg').default,
    description: (
      <>
        AeFinder offers cost-effective data indexing and
        querying, priced solely on data volume, saving you
        over 90% compared to maintaining your own server.
      </>
    ),
  },
  {
    title: 'Enhanced Performance',
    Svg: require('@site/static/img/img_04.svg').default,
    description: (
      <>
        AeFinder ensures a reliable indexing experience with over 99.99% uptime, designed to meet the demands of data-intensive dApps.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
