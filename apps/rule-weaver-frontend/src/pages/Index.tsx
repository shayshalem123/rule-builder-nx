
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Database, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center px-4 py-12 text-center">
      <Database className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Rule Builder</h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Create, manage, and organize logical rules with our intuitive rule builder interface.
      </p>
      <Link to="/rules">
        <Button className="flex items-center text-lg px-6 py-6 h-auto">
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-2">Simple Rules</h3>
          <p className="text-gray-600">
            Create basic field-operator-value rules for straightforward conditions.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-2">AND/OR Logic</h3>
          <p className="text-gray-600">
            Group multiple conditions with AND/OR operators for complex rule definitions.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-2">Nested Groups</h3>
          <p className="text-gray-600">
            Create hierarchical rule structures with nested condition groups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
