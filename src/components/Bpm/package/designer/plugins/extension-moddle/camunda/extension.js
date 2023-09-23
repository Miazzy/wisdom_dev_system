'use strict';
import { isFunction, isObject, some } from 'min-dash';

const WILDCARD = '*';
function CamundaModdleExtension(eventBus) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  eventBus.on('moddleCopy.canCopyProperty', function (context) {
    const property = context.property,
      parent = context.parent;
    return self.canCopyProperty(property, parent);
  });
}

CamundaModdleExtension.$inject = ['eventBus'];
CamundaModdleExtension.prototype.canCopyProperty = function (property, parent) {
  if (isObject(property) && !isAllowedInParent(property, parent)) {
    return false;
  }
  if (is(property, 'camunda:InputOutput') && !this.canHostInputOutput(parent)) {
    return false;
  }
  if (isAny(property, ['camunda:Connector', 'camunda:Field']) && !this.canHostConnector(parent)) {
    return false;
  }
  if (is(property, 'camunda:In') && !this.canHostIn(parent)) {
    return false;
  }
};

CamundaModdleExtension.prototype.canHostInputOutput = function (parent) {
  const connector = getParent(parent, 'camunda:Connector');
  if (connector) {
    return true;
  }
  const flowNode = getParent(parent, 'bpmn:FlowNode');
  if (!flowNode) {
    return false;
  }
  if (isAny(flowNode, ['bpmn:StartEvent', 'bpmn:Gateway', 'bpmn:BoundaryEvent'])) {
    return false;
  }
  return !(is(flowNode, 'bpmn:SubProcess') && flowNode.get('triggeredByEvent'));
};

CamundaModdleExtension.prototype.canHostConnector = function (parent) {
  const serviceTaskLike = getParent(parent, 'camunda:ServiceTaskLike');
  if (is(serviceTaskLike, 'bpmn:MessageEventDefinition')) {
    return getParent(parent, 'bpmn:IntermediateThrowEvent') || getParent(parent, 'bpmn:EndEvent');
  }
  return true;
};

CamundaModdleExtension.prototype.canHostIn = function (parent) {
  const callActivity = getParent(parent, 'bpmn:CallActivity');
  if (callActivity) {
    return true;
  }
  const signalEventDefinition = getParent(parent, 'bpmn:SignalEventDefinition');
  if (signalEventDefinition) {
    return getParent(parent, 'bpmn:IntermediateThrowEvent') || getParent(parent, 'bpmn:EndEvent');
  }
  return true;
};

export default CamundaModdleExtension;

function is(element, type) {
  return element && isFunction(element.$instanceOf) && element.$instanceOf(type);
}

function isAny(element, types) {
  return some(types, function (t) {
    return is(element, t);
  });
}

function getParent(element, type) {
  if (!type) {
    return element.$parent;
  }
  if (is(element, type)) {
    return element;
  }
  if (!element.$parent) {
    return;
  }
  return getParent(element.$parent, type);
}

function isAllowedInParent(property, parent) {
  const descriptor = property.$type && property.$model.getTypeDescriptor(property.$type);
  const allowedIn = descriptor && descriptor.meta && descriptor.meta.allowedIn;
  if (!allowedIn || isWildcard(allowedIn)) {
    return true;
  }
  return some(allowedIn, function (type) {
    return getParent(parent, type);
  });
}

function isWildcard(allowedIn) {
  return allowedIn.indexOf(WILDCARD) !== -1;
}
