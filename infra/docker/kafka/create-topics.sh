#!/bin/sh
# Creates SokoYield platform topics (idempotent).
# Topic payloads/consumers are implemented in Phase 4.
set -e

BOOTSTRAP="kafka:29092"
KT="/opt/kafka/bin/kafka-topics.sh --bootstrap-server $BOOTSTRAP"

create() {
  # name partitions [extra --config flags...]
  name=$1; partitions=$2; shift 2
  $KT --create --if-not-exists --topic "$name" --partitions "$partitions" --replication-factor 1 "$@"
}

# Offline-queued crop photos synced from the Flutter app (Isar queue -> API -> Kafka)
create crop.photo.uploaded      6 --config retention.ms=604800000
# AI diagnosis/grading results from Plantix/Kindwise (dual-mode: mid-season / harvest)
create crop.grade.completed     6
# Failed AI jobs for retry / manual review
create crop.photo.dlq           3 --config retention.ms=1209600000
# Agrio pest & weather alerts fan-out (mobile banner + Twilio SMS)
create alerts.agro.issued       3

echo "Kafka topics:"
$KT --list
