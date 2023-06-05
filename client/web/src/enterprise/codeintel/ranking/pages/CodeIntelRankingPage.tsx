import { FunctionComponent, useEffect } from 'react'

import classNames from 'classnames'
import { format, formatDistance, parseISO } from 'date-fns'

import { Timestamp } from '@sourcegraph/branded/src/components/Timestamp'
import { useMutation } from '@sourcegraph/http-client'
import { TelemetryProps, TelemetryService } from '@sourcegraph/shared/src/telemetry/telemetryService'
import { Button, Container, ErrorAlert, H4, LoadingSpinner, PageHeader, Text } from '@sourcegraph/wildcard'

import { BumpDerivativeGraphKeyResult, BumpDerivativeGraphKeyVariables } from '../../../../graphql-operations'

import { BUMP_DERIVATIVE_GRAPH_KEY, useRankingSummary as defaultUseRankingSummary } from './backend'

import styles from './CodeIntelRankingPage.module.scss'

export interface CodeIntelRankingPageProps extends TelemetryProps {
    useRankingSummary?: typeof defaultUseRankingSummary
    telemetryService: TelemetryService
}

export const CodeIntelRankingPage: FunctionComponent<CodeIntelRankingPageProps> = ({
    useRankingSummary = defaultUseRankingSummary,
    telemetryService,
}) => {
    useEffect(() => telemetryService.logViewEvent('CodeIntelRankingPage'), [telemetryService])

    const { data, loading, error } = useRankingSummary({})

    const [bumpDerivativeGraphKey, { loading: bumping }] = useMutation<
        BumpDerivativeGraphKeyResult,
        BumpDerivativeGraphKeyVariables
    >(BUMP_DERIVATIVE_GRAPH_KEY)

    if (loading && !data) {
        return <LoadingSpinner />
    }

    if (error) {
        return <ErrorAlert prefix="Failed to load code intelligence summary for repository" error={error} />
    }

    return (
        <>
            <PageHeader
                headingElement="h2"
                path={[
                    {
                        text: <>Ranking calculation history</>,
                    },
                ]}
                description="View the history of ranking calculation."
                className="mb-3"
                actions={
                    <Button onClick={() => bumpDerivativeGraphKey()} disabled={bumping} variant="secondary">
                        Start new ranking map/reduce job
                    </Button>
                }
            />

            {data &&
                (data.rankingSummary.length === 0 ? (
                    <Container>
                        <>No data.</>
                    </Container>
                ) : (
                    data.rankingSummary.map(summary => (
                        <Container key={summary.graphKey} className="mb-3">
                            <Summary summary={summary} />
                        </Container>
                    ))
                ))}
        </>
    )
}

interface Summary {
    graphKey: string
    pathMapperProgress: Progress
    referenceMapperProgress: Progress
    reducerProgress: Progress | null
}

interface Progress {
    startedAt: string
    completedAt: string | null
    processed: number
    total: number
}

interface SummaryProps {
    summary: Summary
}

const Summary: FunctionComponent<SummaryProps> = ({ summary }) => (
    <div className="p-2">
        <H4 className="mb-4">Ranking calculation ({summary.graphKey})</H4>

        <div>
            <Progress
                title="Path mapper"
                subtitle="Reads the paths of SCIP indexes exported for ranking and produce path/zero-count pairs consumed by the ranking phase."
                progress={summary.pathMapperProgress}
            />

            <Progress
                title="Reference count mapper"
                subtitle="Reads the symbol references of SCIP indexes exported for ranking, join them to exported definitions, and produce definition path/count pairs consumed by the ranking phase."
                progress={summary.referenceMapperProgress}
                className="mt-4"
            />

            {summary.reducerProgress && (
                <Progress
                    title="Reference count reducer"
                    subtitle="Sums the references for each definition path produced by the mapping phases and groups them by repository."
                    progress={summary.reducerProgress}
                    className="mt-4"
                />
            )}
        </div>
    </div>
)

interface ProgressProps {
    title: string
    subtitle?: string
    progress: Progress
    className?: string
}

const Progress: FunctionComponent<ProgressProps> = ({ title, subtitle, progress, className }) => (
    <div>
        <div className={classNames(styles.tableContainer, className)}>
            <H4 className="m-0">{title}</H4>
            {subtitle && <Text size="small">{subtitle}</Text>}

            <div className={styles.row}>
                <div>Queued records</div>
                <div>
                    {progress.total === 0 ? (
                        <>No records to process</>
                    ) : (
                        <>
                            {progress.processed} of {progress.total} records processed
                        </>
                    )}
                </div>
            </div>

            <div className={styles.row}>
                <div>Progress</div>
                <div>
                    {progress.total === 0 ? 100 : Math.floor((progress.processed * 100 * 100) / progress.total) / 100}%
                </div>
            </div>

            <div className={styles.row}>
                <div>Started</div>
                <div>
                    {format(parseISO(progress.startedAt), 'MMM d y h:mm:ss a')} (
                    <Timestamp date={progress.startedAt} />)
                </div>
            </div>

            {progress.completedAt && (
                <div className={styles.row}>
                    <div>Completed</div>
                    <div>
                        {format(parseISO(progress.completedAt), 'MMM d y h:mm:ss a')} (
                        <Timestamp date={progress.completedAt} />)
                    </div>
                </div>
            )}

            {progress.completedAt && (
                <div className={styles.row}>
                    <div>Duration</div>
                    <div>Ran for {formatDistance(new Date(progress.completedAt), new Date(progress.startedAt))}</div>
                </div>
            )}
        </div>
    </div>
)