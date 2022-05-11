public with sharing class SchemaUtils {
  static Map<String, Schema.SObjectType> globalDescribe;

  public static Map<String, Schema.SObjectType> getGlobalDescribe() {
    if (globalDescribe == null) {
      globalDescribe = Schema.getGlobalDescribe();
    }

    return globalDescribe;
  }

  public static Schema.SObjectType getSObjectTypeByName(String objectName) {
    return ((SObject) Type.forName(objectName)?.newInstance())?.getSObjectType();
  }

  public static Schema.SObjectField getSObjectField(String objectFieldName) {
    List<String> objectAndFieldName = objectFieldName.split('\\.');

    if (objectAndFieldName.isEmpty() || objectAndFieldName.size() != 2) {
      return null;
    }

    String objectName = objectAndFieldName.get(0);
    String fieldName = objectAndFieldName.get(1);

    return getSObjectTypeByName(objectName)?.getDescribe().fields.getMap().get(fieldName);
  }

  public static Schema.SObjectField getSObjectField(String objectName, String fieldName) {
    return getSObjectTypeByName(objectName)?.getDescribe().fields.getMap().get(fieldName);
  }
}
