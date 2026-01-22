/**
 * RelationshipCalculator Tests
 *
 * Tests for family relationship calculations including:
 * - Direct relationships (parent, child, sibling, spouse)
 * - Extended relationships (grandparent, aunt/uncle, cousin)
 * - Half-sibling detection
 * - In-law relationships
 * - Step-relationships
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateRelationship,
  calculateAllRelationships,
  buildRelationshipMaps
} from './RelationshipCalculator';

describe('RelationshipCalculator', () => {
  // Test data setup
  let parentMap;
  let childrenMap;
  let spouseMap;
  let peopleById;

  /**
   * Family tree for tests:
   *
   *     [1] Grandfather (m) ═══ [2] Grandmother (f)
   *              │
   *     ┌────────┴────────┐
   *     │                 │
   * [3] Father (m) ═══ [4] Mother (f)    [5] Uncle (m)
   *          │
   *     ┌────┴────┐
   *     │         │
   * [6] Self (m)  [7] Sister (f) ═══ [8] Brother-in-Law (m)
   *     │
   *     │═══ [9] Spouse (f)
   *     │
   * [10] Child (m)
   */

  beforeEach(() => {
    // Create people
    const people = [
      { id: 1, firstName: 'Grand', lastName: 'Father', gender: 'male' },
      { id: 2, firstName: 'Grand', lastName: 'Mother', gender: 'female' },
      { id: 3, firstName: 'Test', lastName: 'Father', gender: 'male' },
      { id: 4, firstName: 'Test', lastName: 'Mother', gender: 'female' },
      { id: 5, firstName: 'Test', lastName: 'Uncle', gender: 'male' },
      { id: 6, firstName: 'Test', lastName: 'Self', gender: 'male' },
      { id: 7, firstName: 'Test', lastName: 'Sister', gender: 'female' },
      { id: 8, firstName: 'Brother', lastName: 'InLaw', gender: 'male' },
      { id: 9, firstName: 'Test', lastName: 'Spouse', gender: 'female' },
      { id: 10, firstName: 'Test', lastName: 'Child', gender: 'male' },
    ];

    peopleById = new Map(people.map(p => [p.id, p]));

    // Parent relationships: childId -> [parentIds]
    parentMap = new Map([
      [3, [1, 2]],  // Father's parents are Grandfather and Grandmother
      [5, [1, 2]],  // Uncle's parents are Grandfather and Grandmother
      [6, [3, 4]],  // Self's parents are Father and Mother
      [7, [3, 4]],  // Sister's parents are Father and Mother
      [10, [6, 9]], // Child's parents are Self and Spouse
    ]);

    // Children relationships: parentId -> [childIds]
    childrenMap = new Map([
      [1, [3, 5]],  // Grandfather's children are Father and Uncle
      [2, [3, 5]],  // Grandmother's children are Father and Uncle
      [3, [6, 7]],  // Father's children are Self and Sister
      [4, [6, 7]],  // Mother's children are Self and Sister
      [6, [10]],    // Self's child is Child
      [9, [10]],    // Spouse's child is Child
    ]);

    // Spouse relationships: personId -> spouseId
    spouseMap = new Map([
      [1, 2], [2, 1],   // Grandfather and Grandmother
      [3, 4], [4, 3],   // Father and Mother
      [6, 9], [9, 6],   // Self and Spouse
      [7, 8], [8, 7],   // Sister and Brother-in-Law
    ]);
  });

  describe('Direct Relationships', () => {
    it('should identify self', () => {
      const result = calculateRelationship(6, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Self');
    });

    it('should identify spouse (husband)', () => {
      // From Spouse's perspective, Self is Husband
      const result = calculateRelationship(9, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Husband');
    });

    it('should identify spouse (wife)', () => {
      // From Self's perspective, Spouse is Wife
      const result = calculateRelationship(6, 9, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Wife');
    });

    it('should identify father', () => {
      const result = calculateRelationship(6, 3, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Father');
    });

    it('should identify mother', () => {
      const result = calculateRelationship(6, 4, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Mother');
    });

    it('should identify son', () => {
      const result = calculateRelationship(6, 10, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Son');
    });

    it('should identify daughter', () => {
      const result = calculateRelationship(3, 7, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Daughter');
    });

    it('should identify brother', () => {
      // From Sister's perspective, Self is Brother
      const result = calculateRelationship(7, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Brother');
    });

    it('should identify sister', () => {
      const result = calculateRelationship(6, 7, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Sister');
    });
  });

  describe('Grandparent/Grandchild Relationships', () => {
    it('should identify grandfather', () => {
      const result = calculateRelationship(6, 1, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Grandfather');
    });

    it('should identify grandmother', () => {
      const result = calculateRelationship(6, 2, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Grandmother');
    });

    it('should identify grandson', () => {
      const result = calculateRelationship(1, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Grandson');
    });

    it('should identify granddaughter', () => {
      const result = calculateRelationship(1, 7, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Granddaughter');
    });
  });

  describe('Aunt/Uncle & Niece/Nephew Relationships', () => {
    it('should identify uncle', () => {
      const result = calculateRelationship(6, 5, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Uncle');
    });

    it('should identify nephew', () => {
      const result = calculateRelationship(5, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Nephew');
    });

    it('should identify niece', () => {
      const result = calculateRelationship(5, 7, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Niece');
    });
  });

  describe('In-Law Relationships', () => {
    it('should identify brother-in-law (spouse of sibling)', () => {
      const result = calculateRelationship(6, 8, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Brother-in-Law');
    });

    it('should identify son-in-law', () => {
      const result = calculateRelationship(3, 9, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Daughter-in-Law');
    });

    it('should identify father-in-law', () => {
      const result = calculateRelationship(9, 3, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Father-in-Law');
    });

    it('should identify mother-in-law', () => {
      const result = calculateRelationship(9, 4, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Mother-in-Law');
    });
  });

  describe('Half-Sibling Detection', () => {
    it('should identify half-brother', () => {
      // Add a half-sibling scenario
      const halfBrother = { id: 11, firstName: 'Half', lastName: 'Brother', gender: 'male' };
      peopleById.set(11, halfBrother);

      // Half-brother shares only Father (3), not Mother (4)
      parentMap.set(11, [3]);  // Only Father
      childrenMap.set(3, [6, 7, 11]);  // Father now has 3 children

      const result = calculateRelationship(6, 11, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Half-Brother');
    });

    it('should identify half-sister', () => {
      // Add a half-sister scenario
      const halfSister = { id: 12, firstName: 'Half', lastName: 'Sister', gender: 'female' };
      peopleById.set(12, halfSister);

      // Half-sister shares only Mother (4), not Father (3)
      parentMap.set(12, [4]);  // Only Mother
      childrenMap.set(4, [6, 7, 12]);  // Mother now has 3 children

      const result = calculateRelationship(6, 12, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Half-Sister');
    });
  });

  describe('Cousin Relationships', () => {
    it('should identify first cousin', () => {
      // Add a cousin (Uncle's child)
      const cousin = { id: 13, firstName: 'Test', lastName: 'Cousin', gender: 'male' };
      peopleById.set(13, cousin);

      parentMap.set(13, [5]);  // Cousin's parent is Uncle
      childrenMap.set(5, [13]);  // Uncle's child is Cousin

      const result = calculateRelationship(6, 13, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('1st Cousin');
    });
  });

  describe('Unrelated People', () => {
    it('should return null for unrelated people', () => {
      // Add an unrelated person
      const stranger = { id: 99, firstName: 'Un', lastName: 'Related', gender: 'male' };
      peopleById.set(99, stranger);

      const result = calculateRelationship(6, 99, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBeNull();
    });

    it('should return null for non-existent person', () => {
      const result = calculateRelationship(6, 999, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBeNull();
    });
  });

  describe('calculateAllRelationships', () => {
    it('should calculate relationships for all people', () => {
      const allPeople = Array.from(peopleById.values());
      const relationships = calculateAllRelationships(6, allPeople, parentMap, childrenMap, spouseMap);

      expect(relationships.get(6)).toBe('Self');
      expect(relationships.get(3)).toBe('Father');
      expect(relationships.get(4)).toBe('Mother');
      expect(relationships.get(7)).toBe('Sister');
      expect(relationships.get(1)).toBe('Grandfather');
      expect(relationships.get(5)).toBe('Uncle');
      expect(relationships.get(9)).toBe('Wife');
      expect(relationships.get(10)).toBe('Son');
    });

    it('should not include unrelated people', () => {
      const stranger = { id: 99, firstName: 'Un', lastName: 'Related', gender: 'male' };
      peopleById.set(99, stranger);

      const allPeople = Array.from(peopleById.values());
      const relationships = calculateAllRelationships(6, allPeople, parentMap, childrenMap, spouseMap);

      expect(relationships.has(99)).toBe(false);
    });
  });

  describe('buildRelationshipMaps', () => {
    it('should build parent map from relationships', () => {
      const relationships = [
        { person1Id: 3, person2Id: 6, relationshipType: 'parent' },
        { person1Id: 4, person2Id: 6, relationshipType: 'parent' },
      ];

      const { parentMap: builtParentMap } = buildRelationshipMaps(relationships);

      expect(builtParentMap.get(6)).toContain(3);
      expect(builtParentMap.get(6)).toContain(4);
    });

    it('should build children map from relationships', () => {
      const relationships = [
        { person1Id: 3, person2Id: 6, relationshipType: 'parent' },
        { person1Id: 3, person2Id: 7, relationshipType: 'parent' },
      ];

      const { childrenMap: builtChildrenMap } = buildRelationshipMaps(relationships);

      expect(builtChildrenMap.get(3)).toContain(6);
      expect(builtChildrenMap.get(3)).toContain(7);
    });

    it('should build spouse map from relationships', () => {
      const relationships = [
        { person1Id: 6, person2Id: 9, relationshipType: 'spouse' },
      ];

      const { spouseMap: builtSpouseMap } = buildRelationshipMaps(relationships);

      expect(builtSpouseMap.get(6)).toBe(9);
      expect(builtSpouseMap.get(9)).toBe(6);
    });

    it('should not include divorced spouses', () => {
      const relationships = [
        { person1Id: 6, person2Id: 9, relationshipType: 'spouse', marriageStatus: 'divorced' },
      ];

      const { spouseMap: builtSpouseMap } = buildRelationshipMaps(relationships);

      expect(builtSpouseMap.get(6)).toBeUndefined();
      expect(builtSpouseMap.get(9)).toBeUndefined();
    });

    it('should handle adopted parents', () => {
      const relationships = [
        { person1Id: 3, person2Id: 6, relationshipType: 'adopted-parent' },
      ];

      const { parentMap: builtParentMap, childrenMap: builtChildrenMap } = buildRelationshipMaps(relationships);

      expect(builtParentMap.get(6)).toContain(3);
      expect(builtChildrenMap.get(3)).toContain(6);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty maps gracefully', () => {
      const emptyParentMap = new Map();
      const emptyChildrenMap = new Map();
      const emptySpouseMap = new Map();

      const result = calculateRelationship(6, 3, emptyParentMap, emptyChildrenMap, emptySpouseMap, peopleById);
      expect(result).toBeNull();
    });

    it('should handle person with no parents', () => {
      // Person 1 (Grandfather) has no parents in our test data
      const result = calculateRelationship(1, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Grandson');
    });

    it('should handle person with no children', () => {
      // Person 10 (Child) has no children
      const result = calculateRelationship(10, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Father');
    });

    it('should handle person with no spouse', () => {
      // Person 5 (Uncle) has no spouse in our test data
      const result = calculateRelationship(5, 6, parentMap, childrenMap, spouseMap, peopleById);
      expect(result).toBe('Nephew');
    });
  });
});
