public with sharing class EnhancedPathSourceField extends VisualEditor.DynamicPickList {
  VisualEditor.DesignTimePageContext context;

  public EnhancedPathSourceField(VisualEditor.DesignTimePageContext context) {
    this.context = context;
  }

  public override VisualEditor.DataRow getDefaultValue() {
    return this.getValues().get(0);
  }

  public override VisualEditor.DynamicPickListRows getValues() {
    VisualEditor.DynamicPickListRows values = new VisualEditor.DynamicPickListRows();
    Schema.SObjectType objectType = SchemaUtils.getSObjectTypeByName(this.context.entityName);
    Map<String, Schema.SObjectField> fieldsByName = objectType.getDescribe().fields.getMap();

    for (String field : fieldsByName.keySet()) {
      Schema.DisplayType displayType = fieldsByName.get(field).getDescribe().getType();
      if (displayType == Schema.DisplayType.PICKLIST) {
        // String label = fieldsByName.get(field).getDescribe().getLabel();
        String value = fieldsByName.get(field).getDescribe().getName();
        values.addRow(new VisualEditor.DataRow(value, value));
      }
    }

    return values;
  }
}
