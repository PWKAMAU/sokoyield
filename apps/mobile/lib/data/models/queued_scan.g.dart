// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'queued_scan.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types, experimental_member_use

extension GetQueuedScanCollection on Isar {
  IsarCollection<QueuedScan> get queuedScans => this.collection();
}

const QueuedScanSchema = CollectionSchema(
  name: r'QueuedScan',
  id: -3943572717429933023,
  properties: {
    r'aiGrade': PropertySchema(id: 0, name: r'aiGrade', type: IsarType.string),
    r'createdAt': PropertySchema(
      id: 1,
      name: r'createdAt',
      type: IsarType.dateTime,
    ),
    r'cropName': PropertySchema(
      id: 2,
      name: r'cropName',
      type: IsarType.string,
    ),
    r'failureReason': PropertySchema(
      id: 3,
      name: r'failureReason',
      type: IsarType.string,
    ),
    r'farmerId': PropertySchema(
      id: 4,
      name: r'farmerId',
      type: IsarType.string,
    ),
    r'gpsPolygonJson': PropertySchema(
      id: 5,
      name: r'gpsPolygonJson',
      type: IsarType.string,
    ),
    r'localImagePath': PropertySchema(
      id: 6,
      name: r'localImagePath',
      type: IsarType.string,
    ),
    r'quantityKg': PropertySchema(
      id: 7,
      name: r'quantityKg',
      type: IsarType.double,
    ),
    r'retryCount': PropertySchema(
      id: 8,
      name: r'retryCount',
      type: IsarType.long,
    ),
    r'scanId': PropertySchema(id: 9, name: r'scanId', type: IsarType.string),
    r'serverCropId': PropertySchema(
      id: 10,
      name: r'serverCropId',
      type: IsarType.string,
    ),
    r'syncStatus': PropertySchema(
      id: 11,
      name: r'syncStatus',
      type: IsarType.byte,
      enumMap: _QueuedScansyncStatusEnumValueMap,
    ),
    r'timestamp': PropertySchema(
      id: 12,
      name: r'timestamp',
      type: IsarType.dateTime,
    ),
    r'totalPriceKes': PropertySchema(
      id: 13,
      name: r'totalPriceKes',
      type: IsarType.double,
    ),
    r'unitPriceKes': PropertySchema(
      id: 14,
      name: r'unitPriceKes',
      type: IsarType.double,
    ),
  },

  estimateSize: _queuedScanEstimateSize,
  serialize: _queuedScanSerialize,
  deserialize: _queuedScanDeserialize,
  deserializeProp: _queuedScanDeserializeProp,
  idName: r'id',
  indexes: {
    r'scanId': IndexSchema(
      id: -3673513951038601475,
      name: r'scanId',
      unique: true,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'scanId',
          type: IndexType.hash,
          caseSensitive: true,
        ),
      ],
    ),
  },
  links: {},
  embeddedSchemas: {},

  getId: _queuedScanGetId,
  getLinks: _queuedScanGetLinks,
  attach: _queuedScanAttach,
  version: '3.4.1',
);

int _queuedScanEstimateSize(
  QueuedScan object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  {
    final value = object.aiGrade;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  bytesCount += 3 + object.cropName.length * 3;
  {
    final value = object.failureReason;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  bytesCount += 3 + object.farmerId.length * 3;
  bytesCount += 3 + object.gpsPolygonJson.length * 3;
  bytesCount += 3 + object.localImagePath.length * 3;
  bytesCount += 3 + object.scanId.length * 3;
  {
    final value = object.serverCropId;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  return bytesCount;
}

void _queuedScanSerialize(
  QueuedScan object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.aiGrade);
  writer.writeDateTime(offsets[1], object.createdAt);
  writer.writeString(offsets[2], object.cropName);
  writer.writeString(offsets[3], object.failureReason);
  writer.writeString(offsets[4], object.farmerId);
  writer.writeString(offsets[5], object.gpsPolygonJson);
  writer.writeString(offsets[6], object.localImagePath);
  writer.writeDouble(offsets[7], object.quantityKg);
  writer.writeLong(offsets[8], object.retryCount);
  writer.writeString(offsets[9], object.scanId);
  writer.writeString(offsets[10], object.serverCropId);
  writer.writeByte(offsets[11], object.syncStatus.index);
  writer.writeDateTime(offsets[12], object.timestamp);
  writer.writeDouble(offsets[13], object.totalPriceKes);
  writer.writeDouble(offsets[14], object.unitPriceKes);
}

QueuedScan _queuedScanDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = QueuedScan();
  object.aiGrade = reader.readStringOrNull(offsets[0]);
  object.createdAt = reader.readDateTime(offsets[1]);
  object.cropName = reader.readString(offsets[2]);
  object.failureReason = reader.readStringOrNull(offsets[3]);
  object.farmerId = reader.readString(offsets[4]);
  object.gpsPolygonJson = reader.readString(offsets[5]);
  object.id = id;
  object.localImagePath = reader.readString(offsets[6]);
  object.quantityKg = reader.readDouble(offsets[7]);
  object.retryCount = reader.readLong(offsets[8]);
  object.scanId = reader.readString(offsets[9]);
  object.serverCropId = reader.readStringOrNull(offsets[10]);
  object.syncStatus =
      _QueuedScansyncStatusValueEnumMap[reader.readByteOrNull(offsets[11])] ??
      SyncStatus.pending;
  object.timestamp = reader.readDateTime(offsets[12]);
  object.totalPriceKes = reader.readDouble(offsets[13]);
  object.unitPriceKes = reader.readDouble(offsets[14]);
  return object;
}

P _queuedScanDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readStringOrNull(offset)) as P;
    case 1:
      return (reader.readDateTime(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readStringOrNull(offset)) as P;
    case 4:
      return (reader.readString(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    case 6:
      return (reader.readString(offset)) as P;
    case 7:
      return (reader.readDouble(offset)) as P;
    case 8:
      return (reader.readLong(offset)) as P;
    case 9:
      return (reader.readString(offset)) as P;
    case 10:
      return (reader.readStringOrNull(offset)) as P;
    case 11:
      return (_QueuedScansyncStatusValueEnumMap[reader.readByteOrNull(
                offset,
              )] ??
              SyncStatus.pending)
          as P;
    case 12:
      return (reader.readDateTime(offset)) as P;
    case 13:
      return (reader.readDouble(offset)) as P;
    case 14:
      return (reader.readDouble(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

const _QueuedScansyncStatusEnumValueMap = {
  'pending': 0,
  'syncing': 1,
  'synced': 2,
  'failed': 3,
};
const _QueuedScansyncStatusValueEnumMap = {
  0: SyncStatus.pending,
  1: SyncStatus.syncing,
  2: SyncStatus.synced,
  3: SyncStatus.failed,
};

Id _queuedScanGetId(QueuedScan object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _queuedScanGetLinks(QueuedScan object) {
  return [];
}

void _queuedScanAttach(IsarCollection<dynamic> col, Id id, QueuedScan object) {
  object.id = id;
}

extension QueuedScanByIndex on IsarCollection<QueuedScan> {
  Future<QueuedScan?> getByScanId(String scanId) {
    return getByIndex(r'scanId', [scanId]);
  }

  QueuedScan? getByScanIdSync(String scanId) {
    return getByIndexSync(r'scanId', [scanId]);
  }

  Future<bool> deleteByScanId(String scanId) {
    return deleteByIndex(r'scanId', [scanId]);
  }

  bool deleteByScanIdSync(String scanId) {
    return deleteByIndexSync(r'scanId', [scanId]);
  }

  Future<List<QueuedScan?>> getAllByScanId(List<String> scanIdValues) {
    final values = scanIdValues.map((e) => [e]).toList();
    return getAllByIndex(r'scanId', values);
  }

  List<QueuedScan?> getAllByScanIdSync(List<String> scanIdValues) {
    final values = scanIdValues.map((e) => [e]).toList();
    return getAllByIndexSync(r'scanId', values);
  }

  Future<int> deleteAllByScanId(List<String> scanIdValues) {
    final values = scanIdValues.map((e) => [e]).toList();
    return deleteAllByIndex(r'scanId', values);
  }

  int deleteAllByScanIdSync(List<String> scanIdValues) {
    final values = scanIdValues.map((e) => [e]).toList();
    return deleteAllByIndexSync(r'scanId', values);
  }

  Future<Id> putByScanId(QueuedScan object) {
    return putByIndex(r'scanId', object);
  }

  Id putByScanIdSync(QueuedScan object, {bool saveLinks = true}) {
    return putByIndexSync(r'scanId', object, saveLinks: saveLinks);
  }

  Future<List<Id>> putAllByScanId(List<QueuedScan> objects) {
    return putAllByIndex(r'scanId', objects);
  }

  List<Id> putAllByScanIdSync(
    List<QueuedScan> objects, {
    bool saveLinks = true,
  }) {
    return putAllByIndexSync(r'scanId', objects, saveLinks: saveLinks);
  }
}

extension QueuedScanQueryWhereSort
    on QueryBuilder<QueuedScan, QueuedScan, QWhere> {
  QueryBuilder<QueuedScan, QueuedScan, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension QueuedScanQueryWhere
    on QueryBuilder<QueuedScan, QueuedScan, QWhereClause> {
  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(lower: id, upper: id));
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> idGreaterThan(
    Id id, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> idLessThan(
    Id id, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.between(
          lower: lowerId,
          includeLower: includeLower,
          upper: upperId,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> scanIdEqualTo(
    String scanId,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IndexWhereClause.equalTo(indexName: r'scanId', value: [scanId]),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterWhereClause> scanIdNotEqualTo(
    String scanId,
  ) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IndexWhereClause.between(
                indexName: r'scanId',
                lower: [],
                upper: [scanId],
                includeUpper: false,
              ),
            )
            .addWhereClause(
              IndexWhereClause.between(
                indexName: r'scanId',
                lower: [scanId],
                includeLower: false,
                upper: [],
              ),
            );
      } else {
        return query
            .addWhereClause(
              IndexWhereClause.between(
                indexName: r'scanId',
                lower: [scanId],
                includeLower: false,
                upper: [],
              ),
            )
            .addWhereClause(
              IndexWhereClause.between(
                indexName: r'scanId',
                lower: [],
                upper: [scanId],
                includeUpper: false,
              ),
            );
      }
    });
  }
}

extension QueuedScanQueryFilter
    on QueryBuilder<QueuedScan, QueuedScan, QFilterCondition> {
  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNull(property: r'aiGrade'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  aiGradeIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNotNull(property: r'aiGrade'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeEqualTo(
    String? value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  aiGradeGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'aiGrade',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeContains(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'aiGrade',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeMatches(
    String pattern, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'aiGrade',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> aiGradeIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'aiGrade', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  aiGradeIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'aiGrade', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> createdAtEqualTo(
    DateTime value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'createdAt', value: value),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  createdAtGreaterThan(DateTime value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'createdAt',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> createdAtLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'createdAt',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> createdAtBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'createdAt',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  cropNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'cropName',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  cropNameStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameContains(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'cropName',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> cropNameMatches(
    String pattern, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'cropName',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  cropNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'cropName', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  cropNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'cropName', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNull(property: r'failureReason'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNotNull(property: r'failureReason'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonEqualTo(String? value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'failureReason',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonEndsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'failureReason',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'failureReason',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'failureReason', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  failureReasonIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'failureReason', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  farmerIdGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'farmerId',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  farmerIdStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdContains(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'farmerId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> farmerIdMatches(
    String pattern, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'farmerId',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  farmerIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'farmerId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  farmerIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'farmerId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonEqualTo(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'gpsPolygonJson',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonEndsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'gpsPolygonJson',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'gpsPolygonJson',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'gpsPolygonJson', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  gpsPolygonJsonIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'gpsPolygonJson', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> idEqualTo(
    Id value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'id', value: value),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'id',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'id',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'id',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathEqualTo(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'localImagePath',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathEndsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'localImagePath',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'localImagePath',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'localImagePath', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  localImagePathIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'localImagePath', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> quantityKgEqualTo(
    double value, {
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'quantityKg',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  quantityKgGreaterThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'quantityKg',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  quantityKgLessThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'quantityKg',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> quantityKgBetween(
    double lower,
    double upper, {
    bool includeLower = true,
    bool includeUpper = true,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'quantityKg',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> retryCountEqualTo(
    int value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'retryCount', value: value),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  retryCountGreaterThan(int value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'retryCount',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  retryCountLessThan(int value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'retryCount',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> retryCountBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'retryCount',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'scanId',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdContains(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'scanId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdMatches(
    String pattern, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'scanId',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> scanIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'scanId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  scanIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'scanId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNull(property: r'serverCropId'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        const FilterCondition.isNotNull(property: r'serverCropId'),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdEqualTo(String? value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'serverCropId',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdStartsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.startsWith(
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdEndsWith(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.endsWith(
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.contains(
          property: r'serverCropId',
          value: value,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.matches(
          property: r'serverCropId',
          wildcard: pattern,
          caseSensitive: caseSensitive,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'serverCropId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  serverCropIdIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(property: r'serverCropId', value: ''),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> syncStatusEqualTo(
    SyncStatus value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'syncStatus', value: value),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  syncStatusGreaterThan(SyncStatus value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'syncStatus',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  syncStatusLessThan(SyncStatus value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'syncStatus',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> syncStatusBetween(
    SyncStatus lower,
    SyncStatus upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'syncStatus',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> timestampEqualTo(
    DateTime value,
  ) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(property: r'timestamp', value: value),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  timestampGreaterThan(DateTime value, {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'timestamp',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> timestampLessThan(
    DateTime value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'timestamp',
          value: value,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition> timestampBetween(
    DateTime lower,
    DateTime upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'timestamp',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  totalPriceKesEqualTo(double value, {double epsilon = Query.epsilon}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'totalPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  totalPriceKesGreaterThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'totalPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  totalPriceKesLessThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'totalPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  totalPriceKesBetween(
    double lower,
    double upper, {
    bool includeLower = true,
    bool includeUpper = true,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'totalPriceKes',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  unitPriceKesEqualTo(double value, {double epsilon = Query.epsilon}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.equalTo(
          property: r'unitPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  unitPriceKesGreaterThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.greaterThan(
          include: include,
          property: r'unitPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  unitPriceKesLessThan(
    double value, {
    bool include = false,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.lessThan(
          include: include,
          property: r'unitPriceKes',
          value: value,

          epsilon: epsilon,
        ),
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterFilterCondition>
  unitPriceKesBetween(
    double lower,
    double upper, {
    bool includeLower = true,
    bool includeUpper = true,
    double epsilon = Query.epsilon,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(
        FilterCondition.between(
          property: r'unitPriceKes',
          lower: lower,
          includeLower: includeLower,
          upper: upper,
          includeUpper: includeUpper,

          epsilon: epsilon,
        ),
      );
    });
  }
}

extension QueuedScanQueryObject
    on QueryBuilder<QueuedScan, QueuedScan, QFilterCondition> {}

extension QueuedScanQueryLinks
    on QueryBuilder<QueuedScan, QueuedScan, QFilterCondition> {}

extension QueuedScanQuerySortBy
    on QueryBuilder<QueuedScan, QueuedScan, QSortBy> {
  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByAiGrade() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'aiGrade', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByAiGradeDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'aiGrade', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByCreatedAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByCropName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'cropName', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByCropNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'cropName', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByFailureReason() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'failureReason', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByFailureReasonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'failureReason', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByFarmerId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'farmerId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByFarmerIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'farmerId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByGpsPolygonJson() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'gpsPolygonJson', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy>
  sortByGpsPolygonJsonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'gpsPolygonJson', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByLocalImagePath() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'localImagePath', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy>
  sortByLocalImagePathDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'localImagePath', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByQuantityKg() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'quantityKg', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByQuantityKgDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'quantityKg', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByRetryCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'retryCount', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByRetryCountDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'retryCount', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByScanId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'scanId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByScanIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'scanId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByServerCropId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'serverCropId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByServerCropIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'serverCropId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortBySyncStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'syncStatus', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortBySyncStatusDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'syncStatus', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByTimestamp() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'timestamp', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByTimestampDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'timestamp', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByTotalPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'totalPriceKes', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByTotalPriceKesDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'totalPriceKes', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByUnitPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'unitPriceKes', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> sortByUnitPriceKesDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'unitPriceKes', Sort.desc);
    });
  }
}

extension QueuedScanQuerySortThenBy
    on QueryBuilder<QueuedScan, QueuedScan, QSortThenBy> {
  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByAiGrade() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'aiGrade', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByAiGradeDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'aiGrade', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByCreatedAtDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'createdAt', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByCropName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'cropName', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByCropNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'cropName', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByFailureReason() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'failureReason', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByFailureReasonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'failureReason', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByFarmerId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'farmerId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByFarmerIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'farmerId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByGpsPolygonJson() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'gpsPolygonJson', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy>
  thenByGpsPolygonJsonDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'gpsPolygonJson', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByLocalImagePath() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'localImagePath', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy>
  thenByLocalImagePathDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'localImagePath', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByQuantityKg() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'quantityKg', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByQuantityKgDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'quantityKg', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByRetryCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'retryCount', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByRetryCountDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'retryCount', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByScanId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'scanId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByScanIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'scanId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByServerCropId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'serverCropId', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByServerCropIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'serverCropId', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenBySyncStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'syncStatus', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenBySyncStatusDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'syncStatus', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByTimestamp() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'timestamp', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByTimestampDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'timestamp', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByTotalPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'totalPriceKes', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByTotalPriceKesDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'totalPriceKes', Sort.desc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByUnitPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'unitPriceKes', Sort.asc);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QAfterSortBy> thenByUnitPriceKesDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'unitPriceKes', Sort.desc);
    });
  }
}

extension QueuedScanQueryWhereDistinct
    on QueryBuilder<QueuedScan, QueuedScan, QDistinct> {
  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByAiGrade({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'aiGrade', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByCreatedAt() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'createdAt');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByCropName({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'cropName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByFailureReason({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(
        r'failureReason',
        caseSensitive: caseSensitive,
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByFarmerId({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'farmerId', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByGpsPolygonJson({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(
        r'gpsPolygonJson',
        caseSensitive: caseSensitive,
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByLocalImagePath({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(
        r'localImagePath',
        caseSensitive: caseSensitive,
      );
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByQuantityKg() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'quantityKg');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByRetryCount() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'retryCount');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByScanId({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'scanId', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByServerCropId({
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'serverCropId', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctBySyncStatus() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'syncStatus');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByTimestamp() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'timestamp');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByTotalPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'totalPriceKes');
    });
  }

  QueryBuilder<QueuedScan, QueuedScan, QDistinct> distinctByUnitPriceKes() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'unitPriceKes');
    });
  }
}

extension QueuedScanQueryProperty
    on QueryBuilder<QueuedScan, QueuedScan, QQueryProperty> {
  QueryBuilder<QueuedScan, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<QueuedScan, String?, QQueryOperations> aiGradeProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'aiGrade');
    });
  }

  QueryBuilder<QueuedScan, DateTime, QQueryOperations> createdAtProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'createdAt');
    });
  }

  QueryBuilder<QueuedScan, String, QQueryOperations> cropNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'cropName');
    });
  }

  QueryBuilder<QueuedScan, String?, QQueryOperations> failureReasonProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'failureReason');
    });
  }

  QueryBuilder<QueuedScan, String, QQueryOperations> farmerIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'farmerId');
    });
  }

  QueryBuilder<QueuedScan, String, QQueryOperations> gpsPolygonJsonProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'gpsPolygonJson');
    });
  }

  QueryBuilder<QueuedScan, String, QQueryOperations> localImagePathProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'localImagePath');
    });
  }

  QueryBuilder<QueuedScan, double, QQueryOperations> quantityKgProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'quantityKg');
    });
  }

  QueryBuilder<QueuedScan, int, QQueryOperations> retryCountProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'retryCount');
    });
  }

  QueryBuilder<QueuedScan, String, QQueryOperations> scanIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'scanId');
    });
  }

  QueryBuilder<QueuedScan, String?, QQueryOperations> serverCropIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'serverCropId');
    });
  }

  QueryBuilder<QueuedScan, SyncStatus, QQueryOperations> syncStatusProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'syncStatus');
    });
  }

  QueryBuilder<QueuedScan, DateTime, QQueryOperations> timestampProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'timestamp');
    });
  }

  QueryBuilder<QueuedScan, double, QQueryOperations> totalPriceKesProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'totalPriceKes');
    });
  }

  QueryBuilder<QueuedScan, double, QQueryOperations> unitPriceKesProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'unitPriceKes');
    });
  }
}
