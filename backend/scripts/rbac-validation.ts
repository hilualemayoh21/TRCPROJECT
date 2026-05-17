import { requirePermission } from '../src/middleware/rbac.middleware';
import { PermissionError } from '../src/utils/api';
import { Request, Response } from 'express';

function createMockReq(permissions: string[]): Partial<Request> {
  return {
    permissions: new Set(permissions),
    user: { id: 'test-user-id', email: 'test@trc.local', permissionVersion: 1 } as any
  };
}

function createMockRes(): Partial<Response> {
  return {
    status: function (code: number) {
      this.statusCode = code;
      return this;
    },
    json: function (data: any) {
      this.body = data;
      return this;
    }
  } as any;
}

async function runRbacTests() {
  console.log('🛡️ Starting Granular RBAC Middleware Validation...\n');

  // Test Case 1: Permitted Action (Exact Permission Present)
  {
    const req = createMockReq(['view_users', 'create_users']) as Request;
    const res = createMockRes() as Response;
    let nextCalled = false;
    let errorPassed: any = null;

    const middleware = requirePermission('create_users');
    middleware(req, res, (err?: any) => {
      nextCalled = true;
      errorPassed = err;
    });

    if (nextCalled && !errorPassed) {
      console.log('✅ TEST 1 PASSED: "create_users" permission ALLOWED creation action.');
    } else {
      console.log('❌ TEST 1 FAILED: Action blocked despite having the "create_users" permission.');
    }
  }

  // Test Case 2: Blocked Action (Permission Missing)
  {
    const req = createMockReq(['view_users']) as Request; // Missing 'create_users'
    const res = createMockRes() as Response;
    let nextCalled = false;
    let errorPassed: any = null;

    const middleware = requirePermission('create_users');
    middleware(req, res, (err?: any) => {
      nextCalled = true;
      errorPassed = err;
    });

    if (nextCalled && errorPassed instanceof PermissionError) {
      console.log('✅ TEST 2 PASSED: Action blocked cleanly with PermissionError (403 Forbidden) because "create_users" is missing.');
    } else {
      console.log('❌ TEST 2 FAILED: Action allowed or incorrect error returned when "create_users" is missing.');
    }
  }

  // Test Case 3: Super Admin Bypass (Wildcard '*' Present)
  {
    const req = createMockReq(['*']) as Request;
    const res = createMockRes() as Response;
    let nextCalled = false;
    let errorPassed: any = null;

    const middleware = requirePermission('create_users');
    middleware(req, res, (err?: any) => {
      nextCalled = true;
      errorPassed = err;
    });

    if (nextCalled && !errorPassed) {
      console.log('✅ TEST 3 PASSED: Wildcard "*" bypass ALLOWED the creation action.');
    } else {
      console.log('❌ TEST 3 FAILED: Wildcard "*" bypass failed to allow the action.');
    }
  }

  console.log('\n🎉 All RBAC Middleware Security Validations Complete!');
}

runRbacTests().catch(console.error);
